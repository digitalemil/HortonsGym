package com.hortonworks.digitalemil.hdpappstudio.storm;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import backtype.storm.coordination.BatchOutputCollector;
import backtype.storm.task.OutputCollector;
import backtype.storm.task.TopologyContext;
import backtype.storm.topology.OutputFieldsDeclarer;
import backtype.storm.topology.base.BaseRichBolt;
import backtype.storm.tuple.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map.Entry;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.DOMException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;


public class IdentityTransformer extends BaseRichBolt {
	OutputCollector col;
	String[] definedKeys;
	private static final String DEFAULT_CODEPAGE = "UTF-8";


	public boolean keyContained(String key) {
		if (key == null)
			return false;
		for (int i = 0; i < definedKeys.length; i++) {
			if (definedKeys[i] == null)
				continue;
			if (definedKeys[i].equals(key)) {
				return true;
			}
		}
		return false;
	}

	public String transform(String xml) throws ParserConfigurationException,
			UnsupportedEncodingException, SAXException, IOException,
			XPathExpressionException, DOMException, TransformerException {
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		DocumentBuilder db = dbf.newDocumentBuilder();
		ByteArrayOutputStream data= null;
		
		try {
		Document doc = db.parse(new ByteArrayInputStream(xml
				.getBytes(DEFAULT_CODEPAGE)));

		Document n = db.newDocument();
		Element addElement = n.createElement("add");
		Element docElement = n.createElement("doc");
		n.appendChild(addElement);
		addElement.appendChild(docElement);

		String prozessInstanzId = getXPathValue(doc,
				"/events/event/prozessInstanzId");
		
		String zeitPunkt = getXPathValue(doc, "/events/event/zeitpunkt");
		zeitPunkt= zeitPunkt.substring(0, zeitPunkt.length()-6)+"Z";
		
		
		append(n, docElement, zeitPunkt + "_" + prozessInstanzId, "id");

		append(n, docElement, getXPathValue(doc, "/events/event/@type"),
				"nodeType");
		append(n, docElement, getXPathValue(doc, "/events/event/customerId"),
				"customerId");
		append(n, docElement, getXPathValue(doc, "/events/event/ersteller/id"),
				"erstellerId");
		append(n, docElement,
				getXPathValue(doc, "/events/event/ersteller/typ"),
				"erstellerTyp");
		append(n, docElement, prozessInstanzId, "prozessInstanzId");
		append(n, docElement, zeitPunkt, "zeitpunkt");
		append(n, docElement,
				getXPathValue(doc, "/events/event/element/parentElementId"),
				"elementParentElementId");
		append(n, docElement,
				getXPathValue(doc, "/events/event/element/elementUid"),
				"elementElementUid");
		append(n, docElement,
				getXPathValue(doc, "/events/event/element/elementTyp"),
				"elementElementTyp");
		append(n, docElement,
				getXPathValue(doc, "/events/event/element/bpdElementName"),
				"elementBpdElementName");

		
		HashMap<String, String> dat = getXPathValues(doc,
				"/events/event/ereignisdaten/property");

		String prefix = "ereignisdaten_property_";

		for (Entry<String, String> es : dat.entrySet()) {
			append(n, docElement, es.getValue(), clean(prefix + es.getKey()));
		}

		TransformerFactory transformerFactory = TransformerFactory
				.newInstance();
		Transformer transformer = transformerFactory.newTransformer();
		DOMSource source = new DOMSource(n);

		data = new ByteArrayOutputStream();
		StreamResult result = new StreamResult(data);
		transformer.transform(source, result);
		data.close();
		}
		catch(Exception e) {
			System.err.println("Exception: "+e);
		}
		finally {
			System.err.println("In: "+xml);
			System.err.println("Out: "+data.toString());			
		}
		return data.toString();
	}

	private String clean(String input) {
		return input.replaceAll("[^a-zA-Z]", "_");
	}

	private void append(Document n, Element docElement, String value, String key) {
		Element field = n.createElement("field");
		field.setAttribute("name", key);
		field.setTextContent(value);
		docElement.appendChild(field);
	}

	private String getXPathValue(Object doc, String xpath)
			throws XPathExpressionException, DOMException {
		XPathFactory xpathFactory = XPathFactory.newInstance();
		XPathExpression xpe = xpathFactory.newXPath().compile(xpath);
		Node node = (Node) xpe.evaluate(doc, XPathConstants.NODE);
		return (node == null) ? null : node.getTextContent();
	}

	private HashMap<String, String> getXPathValues(Document doc, String xpath)
			throws XPathExpressionException {
		XPathFactory xpathFactory = XPathFactory.newInstance();
		XPathExpression xpe = xpathFactory.newXPath().compile(xpath);
		NodeList rval = (NodeList) xpe.evaluate(doc, XPathConstants.NODESET);
		HashMap<String, String> newHashMap = new HashMap();
		for (int a = 0; a < rval.getLength(); a++) {
			Node item = rval.item(a);
			String key = getXPathValue(item, "key");
			String value = getXPathValue(item, "value");
			newHashMap.put(key, value);
		}
		return newHashMap;
	}

	public void transformTuple(Tuple tuple) throws UnsupportedEncodingException, XPathExpressionException, DOMException, ParserConfigurationException, SAXException, IOException, TransformerException {
		// Extract the data from Kafka and construct JSON doc
		Fields fields = tuple.getFields();
		
		
		String data = new String((byte[]) tuple.getValueByField(fields.get(0)));
		System.out.println("Tuple Key: " + fields.get(0));
		System.out.println("Tuple Value: " + data);

		Values val = new Values();

		val.add(0, transform(data));
		col.emit(tuple, val);

		col.ack(tuple);
		System.out.println("Emitting values: " + val);
	}

	public IdentityTransformer(String[] definedKeys) {
		this.definedKeys = definedKeys;
	}

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void execute(Tuple tuple) {
		try {
			transformTuple(tuple);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void prepare(Map map, TopologyContext ctx, OutputCollector col) {
		this.col = col;
	}

	public void declareOutputFields(OutputFieldsDeclarer decl) {
		List<String> fields = new ArrayList<String>();
		for (int i = 0; i < definedKeys.length; i++) {
			fields.add(definedKeys[i]);
		}
		decl.declare(new Fields(fields));
	}

	public void prepare(Map conf, TopologyContext context,
			BatchOutputCollector collector, Object id) {
		// TODO Auto-generated method stub
	}

	public void finishBatch() {
		// TODO Auto-generated method stub

	}
}
