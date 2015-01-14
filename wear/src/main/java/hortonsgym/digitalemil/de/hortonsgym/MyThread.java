package hortonsgym.digitalemil.de.hortonsgym;

import android.app.Activity;
import android.util.Log;
import android.view.TextureView;
import android.widget.TextView;

import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.PendingResult;
import com.google.android.gms.wearable.DataApi;
import com.google.android.gms.wearable.DataMap;
import com.google.android.gms.wearable.PutDataMapRequest;
import com.google.android.gms.wearable.PutDataRequest;
import com.google.android.gms.wearable.Wearable;

/**
 * Created by emil on 01/12/14.
 */
public class MyThread implements Runnable {
    private String foo= "n/a";
    TextView view;
    Activity activity;
    Thread t= null;
    PutDataMapRequest datamap;
    GoogleApiClient googleApiClient;
    String HR="HR";
    int n= 0;


    public MyThread(PutDataMapRequest dm, GoogleApiClient gac) {
        datamap= dm;
        googleApiClient= gac;
    }


    public void setHR(int hr) {
        Log.d("HRSensor", "Set HR: "+hr);

        foo= ""+hr;
        if(googleApiClient!= null && googleApiClient.isConnected()) {
            datamap.getDataMap().putString(HR, "" + hr + "BPM");
            PutDataRequest request = datamap.asPutDataRequest();
            PendingResult<DataApi.DataItemResult> pendingResult = Wearable.DataApi
                    .putDataItem(googleApiClient, request);
            Log.d("HRSensor", "Data Send: "+"" + hr + "BPM");

        }
        if(activity!= null) {
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    view.setText("Heart rate:\n" + foo + " BPM");
                }
            });
        }

    }

    public void setTextView(TextView tv) {
        view= tv;
        startIfComplete();
    }

    public void setActivity(Activity a) {
        activity= a;
        startIfComplete();
    }


    public void startIfComplete() {
        if((view != null) && (activity != null) && (t == null)) {
         //   t= new Thread(this);
         //   t.start();
        }
    }
     public void run() {
            while(true) {

                activity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        view.setText("Heart rate:\n" + foo+" BPM "+n);
                    }
                });
                if(googleApiClient!= null && googleApiClient.isConnected()) {
                    datamap.getDataMap().putString(HR, "" + n + "BPM" + n);
                    PutDataRequest request = datamap.asPutDataRequest();
                    PendingResult<DataApi.DataItemResult> pendingResult = Wearable.DataApi
                            .putDataItem(googleApiClient, request);
                }
                n++;

                try {
                    Thread.currentThread().sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
    }

}
