package com.hortonworks.digitalemil.hdpappstudio.storm;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.xml.bind.JAXBException;
import javax.xml.transform.sax.SAXSource;

import org.apache.commons.io.IOUtils;
import org.dmg.pmml.DataType;
import org.dmg.pmml.FieldName;
import org.dmg.pmml.IOUtil;
import org.dmg.pmml.OpType;
import org.dmg.pmml.PMML;
import org.dmg.pmml.Target;
import org.dmg.pmml.TreeModel;
import org.jpmml.evaluator.*;
import org.jpmml.manager.*;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import backtype.storm.task.OutputCollector;
import backtype.storm.task.TopologyContext;
import backtype.storm.topology.OutputFieldsDeclarer;
import backtype.storm.topology.base.BaseRichBolt;
import backtype.storm.tuple.Fields;
import backtype.storm.tuple.Tuple;
import backtype.storm.tuple.Values;

import org.apache.zookeeper.*;
import org.apache.zookeeper.Watcher.Event;

public class JPMML extends BaseRichBolt implements Watcher, Runnable {
	private static final long serialVersionUID = 1L;

	String modelString, zk = "127.0.0.1:2181";
	String znode = "/hortonsgym/pmml";

	PMML pmml;
	ModelEvaluator modelEvaluator;
	ZooKeeper zookeeper;

	Map<FieldName, FieldValue> arguments = new LinkedHashMap<FieldName, FieldValue>();

	private OutputCollector collector;
	boolean dead = false;

	public JPMML(String zookeeperString) {
		zk = zookeeperString;
	}

	public static void main(String... args) {
		JPMML jpmml = new JPMML("127.0.0.1:2181");
		jpmml.init();
		jpmml.getColor(65.0);
		jpmml.getColor(140.0);
	}

	public void init() {
		try {
			modelString = new String(zookeeper.getData(znode, false, null))
					.trim();
		} catch (KeeperException e1) {
			e1.printStackTrace();
		} catch (InterruptedException e1) {
			e1.printStackTrace();
		}
		try {
			if (modelString != null && modelString.length() > 0)
				createModelEvaluator(modelString);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private void createModelEvaluator(String modelString) throws SAXException,
			JAXBException {

		InputStream is = new ByteArrayInputStream(modelString.getBytes());

		PMML pmml = IOUtil.unmarshal(is);

		PMMLManager pmmlManager = new PMMLManager(pmml);

		modelEvaluator = (ModelEvaluator) pmmlManager.getModelManager(null,
				ModelEvaluatorFactory.getInstance());

		System.out.println("New model created for: " + modelString);
	}

	public String getColor(Double hr) {
		if (modelString == null || modelString.length() <= 0)
			return "0x80FFFFFF";

		List<FieldName> activeFields = modelEvaluator.getActiveFields();
		for (FieldName activeField : activeFields) {
			FieldValue activeValue = modelEvaluator.prepare(activeField, hr);
			arguments.put(activeField, activeValue);
		}
		
		Map<FieldName, ?> results = modelEvaluator.evaluate(arguments);

		FieldName targetName = modelEvaluator.getTargetField();
		Object targetValue = results.get(targetName);

		NodeClassificationMap nodeMap = (NodeClassificationMap) targetValue;

		/*
		 * System.out.println("Value for HR: "+hr);
		 * System.out.println("Probability (Red): " +
		 * nodeMap.getProbability("0x80FF0000"));
		 * System.out.println("Probability (Green): " +
		 * nodeMap.getProbability("0x8000FF00")); System.out.println("Result: "
		 * + nodeMap.getResult());
		 */
		return nodeMap.getResult();
	}

	public void execute(Tuple tuple) {
		String hr = tuple.getString(4);

		String color = getColor(Double.parseDouble(hr));
		System.out.println("JPMML-Bolt, HR: " + hr + "=> color: " + color);

		String user = tuple.getString(5);
		collector.emit(tuple, new Values(user, user + ":" + color));
		collector.ack(tuple);
	}

	private void initZK(String zk) {
		try {
			zookeeper = new ZooKeeper(zk, 3000, this);
			zookeeper.exists(znode, this);
			dead = false;
			new Thread(this).start();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void prepare(Map arg0, TopologyContext ctx, OutputCollector coll) {
		this.collector = coll;
		initZK(zk);
		init();
	}

	public void declareOutputFields(OutputFieldsDeclarer declarer) {
		declarer.declare(new Fields("user", "color"));
	}

	public void run() {
		System.out.println("Waiting for model changes.");
		try {
			synchronized (this) {
				while (!dead) {
					wait();
				}
			}
		} catch (InterruptedException e) {
		}
	}

	public void process(WatchedEvent event) {
		System.out.println("Zookeeper Event: " + event);
		if (event.getType() == Event.EventType.None) {
			switch (event.getState()) {
			case Disconnected:
			case Expired:
				closing(KeeperException.Code.SessionExpired);
				initZK(zk);
				break;
			}
		}
		try {
			modelString = new String(zookeeper.getData(znode, false, null))
			.trim();
			createModelEvaluator(modelString);
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		try {
			zookeeper.exists(znode, this);
		} catch (KeeperException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public void closing(int rc) {
		synchronized (this) {
			notifyAll();
		}
	}
}
