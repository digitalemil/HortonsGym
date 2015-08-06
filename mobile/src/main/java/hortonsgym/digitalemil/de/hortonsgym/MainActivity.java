        package hortonsgym.digitalemil.de.hortonsgym;

        import android.app.Activity;
        import android.content.Context;
        import android.location.Location;
        import android.location.LocationListener;
        import android.location.LocationManager;
        import android.net.Uri;
        import android.os.Bundle;
        import android.text.Editable;
        import android.text.TextWatcher;
        import android.util.Log;
        import android.view.Menu;
        import android.view.MenuItem;
        import android.view.View;
        import android.widget.Button;
        import android.widget.EditText;
        import android.widget.TextView;

        import com.google.android.gms.common.ConnectionResult;
        import com.google.android.gms.common.api.GoogleApiClient;
        import com.google.android.gms.wearable.DataApi;
        import com.google.android.gms.wearable.DataEvent;
        import com.google.android.gms.wearable.DataEventBuffer;
        import com.google.android.gms.wearable.Wearable;

        import java.io.BufferedReader;
        import java.io.BufferedWriter;
        import java.io.DataInputStream;
        import java.io.DataOutputStream;
        import java.io.File;
        import java.io.FileInputStream;
        import java.io.FileNotFoundException;
        import java.io.FileOutputStream;
        import java.io.IOException;
        import java.io.InputStreamReader;
        import java.io.OutputStream;
        import java.io.OutputStreamWriter;
        import java.net.HttpURLConnection;
        import java.net.URL;
        import java.util.Calendar;
        import java.util.Stack;
        import java.util.TimeZone;


        public class MainActivity extends Activity implements Runnable, LocationListener, GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener,  DataApi.DataListener, TextWatcher {
            GoogleApiClient mGoogleApiClient;
            static String TAG = "Horton's Gym", HR = "HR";
            static TextView view;
            EditText editServer, editUser;
            String newval;
            static String server = "";
            static String user = "Horton";
            static String location = "0,0";
            static String bpm;
            static Object lock = new Object();
            static String json = null;
            static Activity activity;
            static final String FNAME = "hortonsgym.bin";
            static boolean online= false;
            static TextView networkStatus;
            static Button uploadButton;
            static String s;
            boolean offline= false;
            boolean buttonClicked= false;
            static StringBuffer inmembuf= new StringBuffer();
            final static String DATAFNAME ="data.json";

            static Stack<String> docs= new Stack<String>();

            public static void addDoc(String doc) {
                synchronized (docs) {
                    docs.push(doc);
                }
            }


            protected String getDoc() {
                synchronized (docs) {
                    try {
                        if (docs.isEmpty())
                            return null;
                        return docs.pop();
                    }
                    catch(Exception e) {
                        return null;
                    }
                }
            }
            @Override
            protected void onCreate(Bundle savedInstanceState) {
                super.onCreate(savedInstanceState);
                setContentView(R.layout.activity_main);

                activity = this;

                mGoogleApiClient = new GoogleApiClient.Builder(this)
                        .addConnectionCallbacks(new GoogleApiClient.ConnectionCallbacks() {
                            @Override
                            public void onConnected(Bundle connectionHint) {
                                Log.d(TAG, "onConnected: " + connectionHint);
                                // Now you can use the Data Layer API
                            }

                            @Override
                            public void onConnectionSuspended(int cause) {
                                Log.d(TAG, "onConnectionSuspended: " + cause);
                            }
                        })
                        .addOnConnectionFailedListener(new GoogleApiClient.OnConnectionFailedListener() {
                            @Override
                            public void onConnectionFailed(ConnectionResult result) {
                                Log.d(TAG, "onConnectionFailed: " + result);
                            }
                        })
                                // Request access only to the Wearable API
                        .addApi(Wearable.API)
                        .build();


                networkStatus = (TextView) findViewById(R.id.networkStatus);
                uploadButton = (Button) findViewById(R.id.uploadButton);

                uploadButton.setOnClickListener(new View.OnClickListener() {
                    public void onClick(View v) {
                        Log.d(TAG, "Button clicked: "+inmembuf);
                       if(inmembuf!= null && inmembuf.length()> 0) {
                            buttonClicked= true;
                       }
                    }
                });

                view = (TextView) findViewById(R.id.textView);
                editServer = (EditText) findViewById(R.id.editServer);
                editServer.addTextChangedListener(this);

                editUser = (EditText) findViewById(R.id.editUser);
                editUser.addTextChangedListener(new TextWatcher() {
                    @Override
                    public void beforeTextChanged(CharSequence s, int start, int count, int after) {

                    }

                    @Override
                    public void onTextChanged(CharSequence s, int start, int before, int count) {

                    }

                    @Override
                    public void afterTextChanged(Editable s) {
                        user = editUser.getText().toString();
                        save(server, user);
                    }
                });

                LocationManager locationManager = (LocationManager)
                        getSystemService(Context.LOCATION_SERVICE);
                locationManager.requestLocationUpdates(
                        LocationManager.GPS_PROVIDER, 5000, 10, this);

                Thread t = new Thread(this);
                t.start();
            }

            @Override
            protected void onStart() {
                super.onStart();
                mGoogleApiClient.registerConnectionCallbacks(this);
                mGoogleApiClient.connect();
                load();
                loadData();
            //    Thread t= new Thread(new HRSimulator());
            //    t.start();
            }

            public void loadData() {
                try {
                    File file = new File(activity.getFilesDir(), DATAFNAME);
                //    file.delete();
                    FileInputStream fis = activity.openFileInput(DATAFNAME);
                    BufferedReader buf= new BufferedReader(new InputStreamReader(fis));
                    docs.setSize(0);
                    String line= null;
                 synchronized (docs) {
                     do {
                         line = buf.readLine();
                         if (line != null) {
                             line= line.trim();
                             addDoc(line);
                             Log.d(TAG, "Loaded: "+line);
                         }
                     }
                     while (null != line);
                     Log.d(TAG, "Loaded from file: " + docs);
                 }
                }
                catch(Exception e) {

                }
            }


            public static String payLoadToString(String payload) {
                bpm = getBPMFromPayload(payload);
                Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
                String time= cal.get(Calendar.YEAR)+"-"+(new Integer(cal.get(Calendar.MONTH))+1)+"-"+cal.get(Calendar.DAY_OF_MONTH)+"T"+cal.get(Calendar.HOUR_OF_DAY)+":"+cal.get(Calendar.MINUTE)+":"+cal.get(Calendar.SECOND)+"."+(""+(new Integer(cal.get(Calendar.MILLISECOND))/1000.0f)).substring(2)+"Z";

                String json = "{'id':'" + System.currentTimeMillis() + "', 'location':'" + location + "', 'event_timestamp':'" + time + "', 'deviceid':'" + user + "', 'user':'" + user + "', 'heartrate':'" + bpm + "'}";

                activity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        view.setText("Heart rate:\n" + bpm + "\nBPM");
                    }

                });

                return json;
            }

            public void run() {
                while (true) {
                    try {
                        Thread.currentThread().sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    if(buttonClicked) {
                        if (postBulk(inmembuf.toString())) {
                            inmembuf.setLength(0);
                            try {
                                File file = new File(activity.getFilesDir(), DATAFNAME);
                                file.delete();
                            }
                            catch(Exception e) {
                                e.printStackTrace();
                            }
                                activity.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {

                                    uploadButton.setVisibility(View.INVISIBLE);
                                    uploadButton.setEnabled(false);
                                }
                            });
                        }
                        buttonClicked= false;
                    }
                    json = getDoc();
                    if (json != null) {
                        Log.d(TAG, "Posting json: " + json+ " "+docs);
                        if (!post(json)) {
                            activity.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    addDoc(json);
                                    networkStatus.setText("Offline");
                                    offline= true;
                                    networkStatus.setVisibility(View.VISIBLE);
                                    uploadButton.setVisibility(View.INVISIBLE);
                                    uploadButton.setEnabled(false);
                                }
                            });
                        } else {
                            activity.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {

                                    networkStatus.setText("Online");
                                    networkStatus.setVisibility(View.VISIBLE);
                                    boolean f= false;
                                    if (docs.size()>2) {
                                        if(offline== true) {
                                            inmembuf= new StringBuffer();
                                            synchronized (docs) {
                                                while(!docs.isEmpty()) {
                                                    String d= getDoc();
                                                    if(f) {
                                                        for(int i= 0; i< 8192; i++) {
                                                            inmembuf.append(d+"\n");
                                                        }
                                                        f= false;
                                                    }
                                                    inmembuf.append(d+"\n");
                                                }
                                                docs.clear();
                                                Log.d(TAG, "In Mem: " + inmembuf);
                                            }
                                        }
                                        uploadButton.setVisibility(View.VISIBLE);
                                        uploadButton.setEnabled(true);
                                    }
                                    offline= false;
                                }
                            });
                        }
                    }
                }
            }


            @Override
            public void onConnected(Bundle connectionHint) {
                Wearable.DataApi.addListener(mGoogleApiClient, this);
            }


            @Override
            public boolean onCreateOptionsMenu(Menu menu) {
                // Inflate the menu; this adds items to the action bar if it is present.
                getMenuInflater().inflate(R.menu.menu_main, menu);
                return true;
            }

            @Override
            public boolean onOptionsItemSelected(MenuItem item) {
                // Handle action bar item clicks here. The action bar will
                // automatically handle clicks on the Home/Up button, so long
                // as you specify a parent activity in AndroidManifest.xml.
                int id = item.getItemId();

                //noinspection SimplifiableIfStatement
                if (id == R.id.action_settings) {
                    return true;
                }

                return super.onOptionsItemSelected(item);
            }

            @Override
            public void onConnectionSuspended(int i) {

            }

            @Override
            public void onDataChanged(DataEventBuffer dataEvents) {

                for (DataEvent event : dataEvents) {
                    if (event.getType() == DataEvent.TYPE_DELETED) {
                        Log.d(TAG, "DataItem deleted: " + event.getDataItem().getUri());
                    } else { //if (event.getType() == DataEvent.TYPE_CHANGED) {
                        Log.d(TAG, "DataItem changed: " + event.getDataItem().getUri());

                        Uri uri = event.getDataItem().getUri();

                        // Get the node id from the host value of the URI
                        String nodeId = uri.getHost();
                        // Set the data of the message to be the bytes of the URI

                        // payload = uri.toString()
                        byte[] payload = event.getDataItem().getData();

                        newval = new String(payload);
                        Log.d(TAG, "NEWVAL: " + newval);

                        if (newval.contains("BPM")) {
                            addDoc(payLoadToString(newval));
                        }
                    }
                }
            }

            private static String getBPMFromPayload(String newval) {
                String hr = newval.substring(newval.indexOf('H') + 2).trim();
                return hr.substring(0, hr.indexOf('B'));
            }

            @Override
            protected void onStop() {

                synchronized (docs) {
                    if (docs.isEmpty() || docs.size() < 4) {
                        super.onStop();
                        return;
                    }
                    try {
                        File file = new File(activity.getFilesDir(), DATAFNAME);
                        file.delete();

                        FileOutputStream fos = activity.openFileOutput(DATAFNAME,
                                Context.MODE_PRIVATE);
                        BufferedWriter bw= new BufferedWriter(new OutputStreamWriter(fos));
                        while (!docs.isEmpty()) {
                            String doc = getDoc().trim();
                            bw.write(doc + "\n");
                            Log.d(TAG, "Saved: "+doc);
                        }
                        bw.close();
                        fos.close();
                        Log.d(TAG, "Saved: " + docs);

                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                super.onStop();
                mGoogleApiClient.disconnect();
            }

            @Override
            public void onConnectionFailed(ConnectionResult connectionResult) {

            }

            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {
                server = editServer.getText().toString();
                save(server, user);
            }

            public boolean postBulk(String docs) {
                if (server.length() == 0) {
                    server = editServer.getText().toString();
                }
                String url = "http://" + server + "/data/upload";
                if(server.startsWith("http"))
                    url= server;
                return post(docs, url);
            }

            public boolean post(String json) {
                if (server.length() == 0) {
                    server = editServer.getText().toString();
                }
                String url = "http://" + server + "/data/publish";
                if(server.startsWith("http"))
                    url= server;
                return post(json, url);
            }

            public boolean post(String json, String url) {
                try {

                    //Connect
                    HttpURLConnection httpcon = (HttpURLConnection) ((new URL(url).openConnection()));
                    httpcon.setDoOutput(true);
                    httpcon.setRequestProperty("Content-Type", "application/json");
                    httpcon.setRequestProperty("Accept", "application/json");
                    httpcon.setRequestMethod("POST");
                    httpcon.connect();

                    //Write
                    OutputStream os = httpcon.getOutputStream();
                    BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));

                    writer.write(json);
                    writer.close();
                    os.close();

                    //Read
                    BufferedReader br = new BufferedReader(new InputStreamReader(httpcon.getInputStream(), "UTF-8"));

                    String line = null;
                    StringBuilder sb = new StringBuilder();

                    while ((line = br.readLine()) != null) {
                        sb.append(line);
                    }

                    br.close();
                } catch (Exception e) {
                    Log.d(TAG, e.toString());
                    Log.d(TAG, "URL: " + url);
                    return false;
                }
                return true;
            }

            @Override
            public void onLocationChanged(Location loc) {
                String longitude = "Longitude: " + loc.getLongitude();
                Log.v(TAG, longitude);
                String latitude = "Latitude: " + loc.getLatitude();
                Log.v(TAG, latitude);
                location = loc.getLatitude() + "," + loc.getLongitude();
            }

            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) {

            }

            @Override
            public void onProviderEnabled(String provider) {

            }

            @Override
            public void onProviderDisabled(String provider) {
            }

            public void save(String server, String user) {
                try {
                    FileOutputStream fos = activity.openFileOutput(FNAME,
                            Context.MODE_PRIVATE);
                    DataOutputStream dos = new DataOutputStream(fos);

                    dos.writeUTF(server);
                    dos.writeUTF(user);
                    dos.close();
                    fos.close();
                } catch (Exception e) {
                    Log.v(TAG, "Error saving: " + user + "@" + server);
                }
            }

            public void load() {
                File file = new File(activity.getFilesDir(), FNAME);

                FileInputStream fis = null;
                try {
                    fis = openFileInput(FNAME);
                    DataInputStream dis = new DataInputStream(fis);
                    server = dis.readUTF();
                    user = dis.readUTF();
                } catch (FileNotFoundException e) {
                    Log.v(TAG, "Error loading: " + user + "@" + server);
                } catch (IOException e) {
                    Log.v(TAG, "Error loading: " + user + "@" + server);
                }

                activity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        editServer.setText(server);
                        editUser.setText(user);
                    }

                });

            }



        }