package com.hortonworks.digitalemil.hdpappstudio.storm;

import java.io.ByteArrayInputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.nio.charset.Charset;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
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
import org.json.JSONObject;
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

	static String modelString, zk = "127.0.0.1:2181";
	static String znode = "/hortonsgym/pmml";

	static PMML pmml;
	static ModelEvaluator modelEvaluator;
	static ZooKeeper zookeeper;
	static String lastloc= "";
	static long lastdate= 0;
	
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
		if (modelEvaluator != null)
			return;
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

		try {
			List<FieldName> activeFields = modelEvaluator.getActiveFields();
			for (FieldName activeField : activeFields) {
				FieldValue activeValue = modelEvaluator
						.prepare(activeField, hr);
				arguments.put(activeField, activeValue);
			}

			Map<FieldName, ?> results = modelEvaluator.evaluate(arguments);

			FieldName targetName = modelEvaluator.getTargetField();
			Object targetValue = results.get(targetName);

			NodeClassificationMap nodeMap = (NodeClassificationMap) targetValue;
			return nodeMap.getResult();
		} catch (Exception e) {
			System.out.println("Could not evaulate model. Skipping.");
			return null;
		}
		/*
		 * System.out.println("Value for HR: "+hr);
		 * System.out.println("Probability (Red): " +
		 * nodeMap.getProbability("0x80FF0000"));
		 * System.out.println("Probability (Green): " +
		 * nodeMap.getProbability("0x8000FF00")); System.out.println("Result: "
		 * + nodeMap.getResult());
		 */
		
	}

	private boolean post(String serverUrl, String json) {
		URL url = null;
		try {
			url = new URL(serverUrl);
		} catch (MalformedURLException e) {
			e.printStackTrace();
			return false;
		}
		HttpURLConnection connection = null;
		try {
			connection = (HttpURLConnection) url.openConnection();
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		}
		connection.setDoOutput(true);
		connection.setDoInput(true);
		connection.setInstanceFollowRedirects(false);
		try {
			connection.setRequestMethod("POST");
		} catch (ProtocolException e) {
			e.printStackTrace();
		}
		connection.setRequestProperty("Content-Type", "application/json");
		connection.setRequestProperty("charset", "utf-8");
		connection.setRequestProperty("Content-Length",
				"" + Integer.toString(json.getBytes().length));
		connection.setUseCaches(false);

		try {
			DataOutputStream wr = new DataOutputStream(
					connection.getOutputStream());
			wr.writeBytes(json);
			wr.flush();
			wr.close();
			DataInputStream r = new DataInputStream(connection.getInputStream());
			String line = null;
			do {
				line = r.readLine();
				if (line != null)
					System.out.println(line);
			} while (line != null);
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		}
		try {
			System.out.println("ResponseCode: "+connection.getResponseCode());
			if (connection.getResponseCode() != 200) {
				connection.disconnect();
				return false;
			}

		} catch (IOException e) {
			e.printStackTrace();
			return false;
		}
		connection.disconnect();
		return true;
	}
	
	public void execute(Tuple tuple) {
		String hr = tuple.getString(4);

		String color = getColor(Double.parseDouble(hr));
		System.out.println("JPMML-Bolt, HR: " + hr + "=> color: " + color);

		String user = tuple.getString(5);
		collector.emit(tuple, new Values(user, user + ":" + color));
		collector.ack(tuple);
		/*
		String hr = tuple.getString(4);
		String loc= tuple.getString(1).substring(0,2);
		String date= tuple.getString(2);
		
		DateFormat dfmt = new SimpleDateFormat( "yyyy-M-d'T'H:m:s'Z'" );
		Date d= null, dl= null;
		try {
			d = dfmt.parse(date);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		long thisdate= d.getTime();
		long delta= thisdate- lastdate;
		boolean dateok= delta>(60*1000);
				
		String color = getColor(Double.parseDouble(hr));
		System.out.println("C before: "+color+" "+loc+" "+lastloc);
		JSONObject json= new JSONObject();
		
		for(int i= 0; i< tuple.size(); i++) {
			json.put(tuple.getFields().get(i), tuple.getString(i));
		}
		if(!loc.equals(lastloc) && lastloc.length()> 0 &&!dateok) {
			
			json.put("fraud", 1);
			post("http://hortonsgym01.cloud.hortonworks.com:8983/solr/tx/update/json?commit=true", "["+json.toString()+"]");
			
			color= "0x80FF0000";
		}
		else {
			json.put("fraud", 0);
			post("http://hortonsgym01.cloud.hortonworks.com:8983/solr/tx/update/json?commit=true", "["+json.toString()+"]");
			color= "0x8000FF00";
			lastloc= loc;
			lastdate= thisdate;
		}
		
		System.out.println("C after: "+color);
		System.out.println("JPMML-Bolt " + hr + "=> color: " + color);

		String user = tuple.getString(5);
		collector.emit(tuple, new Values(user, user + ":" + color));
		collector.ack(tuple);
		*/
	}

	private void initZK(String zk) {
		if (zookeeper != null && !dead)
			return;
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
