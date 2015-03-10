package hortonsgym.digitalemil.de.hortonsgym;

import android.util.Log;

/**
 * Created by emil on 27/02/15.
 */
public class HRSimulator implements Runnable {
    static int hr;
    String s;

    public void run() {
        try {


          while(hr< 8192) {
              s = MainActivity.payLoadToString("HR " + hr + "BMP");
              hr++;
              Log.d(MainActivity.TAG, "fake: " + s);
              MainActivity.activity.runOnUiThread(new Runnable() {
                  @Override
                  public void run() {
                      MainActivity.addDoc(s);
                  }
              });
              Thread.sleep(2000);
          }
        }
        catch(Exception e) {
            e.printStackTrace();
        }
    }
}
