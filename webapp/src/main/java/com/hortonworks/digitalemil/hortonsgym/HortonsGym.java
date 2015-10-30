package com.hortonworks.digitalemil.hortonsgym;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.Writer;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.FileHandler;
import java.util.logging.Handler;
import java.util.logging.Logger;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javax.xml.bind.JAXBException;
import org.dmg.pmml.FieldName;
import org.dmg.pmml.IOUtil;
import org.dmg.pmml.PMML;
import org.jpmml.evaluator.FieldValue;
import org.jpmml.evaluator.ModelEvaluator;
import org.jpmml.evaluator.ModelEvaluatorFactory;
import org.jpmml.evaluator.NodeClassificationMap;
import org.jpmml.manager.PMMLManager;
import org.json.JSONException;
import org.json.JSONObject;
import org.xml.sax.SAXException;

/**
 * Servlet implementation class HortonsGym
 */
public class HortonsGym extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private HashMap<String, HeartRateMeasurement> last = new HashMap<String, HeartRateMeasurement>();
	public static HashMap<String, ColorInfo> colors = new HashMap<String, ColorInfo>();
	public static HashSet<String> heartrates = new HashSet<String>();
	public static Logger hrlogger;
	public static Logger stepslogger;
	public static boolean onGoogleAppEngine = false;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public HortonsGym() {
		super();
	}

	@Override
	public void init(ServletConfig cfg) throws ServletException {
		super.init(cfg);

		if ("true".equals(cfg.getInitParameter("onGoogleAppEngine")))
			onGoogleAppEngine = true;

		if (!onGoogleAppEngine) {
			hrlogger = Logger
					.getLogger("com.hortonworks.digitalemil.hortonsgym.heartrates");
			stepslogger = Logger
					.getLogger("com.hortonworks.digitalemil.hortonsgym.steps");

			try {
				Handler fileHandler = new FileHandler("logs/hrdata.out");
				LogFormatter formatter = new LogFormatter();
				fileHandler.setFormatter(formatter);
				hrlogger.addHandler(fileHandler);

				Handler stepsfileHandler = new FileHandler(
						"logs/stepsfromhkdata.out");
				stepsfileHandler.setFormatter(formatter);
				stepslogger.addHandler(stepsfileHandler);

			} catch (SecurityException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	private void handleSteps(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		BufferedReader reader = request.getReader();
		StringBuffer json = new StringBuffer();
		JSONObject jobj = null;

		do {
			String line = reader.readLine();
			if (line == null)
				break;
			json.append(line + "\n");
		} while (true);

		if (!insafemode && stepslogger != null)
			stepslogger.severe(json.toString());
		try {
			jobj = new JSONObject(json.toString());
		} catch (JSONException e) {
			response.setStatus(500);

			e.printStackTrace();
		}

		System.out.println("Received JSON Activity (steps): " + jobj + " \n"
				+ json);
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		if (request.getRequestURI().contains("color")) {
			handleColor(request, response);
			return;
		}
		if (request.getRequestURI().contains("steps")) {
			handleSteps(request, response);
			return;
		}

		// Handling Heartrate
		BufferedReader reader = request.getReader();
		StringBuffer json = new StringBuffer();
		JSONObject jobj = null;

		do {
			String line = reader.readLine();
			if (line == null)
				break;
			json.append(line + "\n");
		} while (true);

		if (!insafemode && hrlogger != null)
			hrlogger.severe(json.toString());

		try {
			jobj = new JSONObject(json.toString());
		} catch (JSONException e) {
			response.setStatus(500);
			e.printStackTrace();
		}

		HeartRateMeasurement hrm = new HeartRateMeasurement(jobj, colors);
		System.out.println("HRM created: " + hrm + " key: "
				+ jobj.getString("deviceid"));
		if((jobj.getString("deviceid")!= null) && (colors.get(jobj.getString("deviceid"))!= null) ) {
			String curColor= colors.get(jobj.getString("deviceid")).color;
			colors.put(jobj.getString("deviceid"), new ColorInfo(jobj.getString("deviceid"), curColor));
		}
		last.put(jobj.getString("deviceid"), hrm);

		System.out.println("Received JSON: " + jobj);
		
		heartrates.add(jobj.toString());

		if (insafemode) {
			try {
				String user= jobj.getString("user");
				colors.put(user,
						new ColorInfo(user, getColor(jobj.getDouble("heartrate"))));
			} catch (Exception e) {
			}
		}
	}

	private void handleColor(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		BufferedReader reader = request.getReader();

		StringBuffer in = new StringBuffer();
		do {
			String line = reader.readLine();
			if (line == null)
				break;
			in.append(line);
		} while (true);
		// Shaun:0x80FF0000
		String str = in.toString();
		String user = str.substring(0, str.indexOf(":"));
		String color = str.substring(str.indexOf(":") + 1);
		System.out.println("Color for user " + user + ": " + color);
		colors.put(user, new ColorInfo(user, color));
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		if (request.getRequestURI().contains("safe")
				|| request.getRequestURI().contains("save")) {
			System.out.println("Turning savemode on...");
			insafemode = true;
			return;
		}
		Writer writer = response.getWriter();

		if (request.getRequestURI().contains("pull")) {
			response.setContentType("plain/text");
			for (String s : heartrates) {
				// s= s.replace("heartrate", "amount");
				writer.write(s + "|");
			}
			writer.flush();
			heartrates.clear();
			return;
		}

		String ret = "{\"session\":{\"begincomment\":null,\"dayssince01012012\":0,\"dummy\":null,\"endcomment\":null,\"ended\":null,\"groupid\":{\"id\":1,\"name\":\"Default\"},\"id\":0,\"start\":0},\"users\":[";

		writer.write(ret);
		boolean first = true;
		for (HeartRateMeasurement hrm : last.values()) {
			String json = hrm.toString();
			if (json.length() > 0) {
				System.out.println("HRM: " + hrm);

				if (!first)
					writer.write(", ");
				else
					first = false;

				writer.write(json);

			}
		}
		writer.write("]}");
		writer.flush();
	}

	//
	// Needed to run without Hadoop
	//
	private static void createModelEvaluator(String modelString)
			throws SAXException, JAXBException {

		InputStream is = new ByteArrayInputStream(modelString.getBytes());

		PMML pmml = IOUtil.unmarshal(is);

		PMMLManager pmmlManager = new PMMLManager(pmml);

		modelEvaluator = (ModelEvaluator) pmmlManager.getModelManager(null,
				ModelEvaluatorFactory.getInstance());

		System.out.println("New model created for: " + modelString);
	}

	public String getColor(Double hr) {
		if (modelString == null || modelString.length() <= 0
				|| modelEvaluator == null)
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
		return nodeMap.getResult();
	}

	public static boolean isInSafeMode() {
		return insafemode;
	}

	public static void setModelString(String s) {
		modelString = s;
		try {
			createModelEvaluator(modelString);
		} catch (SAXException e) {
			e.printStackTrace();
		} catch (JAXBException e) {
			e.printStackTrace();
		}
	}

	public static String getModelString() {
		return modelString;
	}

	static private boolean insafemode = false;
	private static ModelEvaluator modelEvaluator;
	private static String modelString = "";
	PMML pmml;
	Map<FieldName, FieldValue> arguments = new LinkedHashMap<FieldName, FieldValue>();

}
