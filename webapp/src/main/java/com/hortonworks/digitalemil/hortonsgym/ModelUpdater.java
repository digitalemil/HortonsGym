package com.hortonworks.digitalemil.hortonsgym;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Writer;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class ModelUpdater
 */
public class ModelUpdater extends HttpServlet {
	private static final long serialVersionUID = 1L;
	String pmml;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ModelUpdater() {
		super();
	}

	@Override
	public void init(ServletConfig cfg) throws ServletException {
		super.init(cfg);
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		if (request.getRequestURI().contains("pmml")) {
			handlePMML(request, response);
			return;
		}

		Writer writer = response.getWriter();

		if (HortonsGym.isInSafeMode()) {
			pmml = HortonsGym.getModelString();
		}
		System.out.println("pmml: " + pmml);
		try {
			BufferedReader br = new BufferedReader(new InputStreamReader(this
					.getClass().getResourceAsStream("/model.html")));
			String line;
			System.out.println(request.getParameter("user") + ":"
					+ request.getParameter("passwd"));
			while ((line = br.readLine()) != null) {
				if (line.contains("PMMLCONTENT")) {
					line = pmml;
					if (line == null)
						line = "";
				}

				if (line.contains("UPLOAD")) {
					if ("admin".equals(request.getParameter("user"))
							&& "Admin".equals(request.getParameter("passwd"))) {
						line = "<input type='button' name='Upload' value='Upload' onclick='postPMML(document.getElementById(\"pmml\").value);' tabindex=3/>";
					} else {
						line = "";
					}
				}

				if (line.contains("UPDATE")) {
					line = "req.open(\"POST\", \"update?user="
							+ request.getParameter("user") + "&passwd="
							+ request.getParameter("passwd") + "\", true)";
				}
				writer.write(line + "\n");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private void handlePMML(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		Writer writer = response.getWriter();
		response.setContentType("plain/text");
		if(pmml!= null)
			writer.write(pmml);
		writer.flush();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		if (!"admin".equals(request.getParameter("user"))
				|| !"Admin".equals(request.getParameter("passwd"))) {
			System.out.println("Upload not allowed for: "
					+ request.getParameter("user") + ":"
					+ request.getParameter("passwd"));
			return;
		}
		BufferedReader reader = request.getReader();
		StringBuffer in = new StringBuffer();

		do {
			String line = reader.readLine();
			if (line == null)
				break;
			in.append(line);
		} while (true);
		System.out.println("Set pmml to: " + in.toString());
		if (HortonsGym.isInSafeMode()) {
			HortonsGym.setModelString(in.toString());
		} else {
			pmml = in.toString();
		}
	}

}
