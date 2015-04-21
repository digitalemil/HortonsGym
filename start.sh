#!/bin/bash

export APPNAME=HortonsGym
export FIELDS="id location event_timestamp deviceid heartrate user "
export DDL="Create External Table hr (id String, location String, event_timestamp String, deviceid String, heartrate BigInt, user String) ROW FORMAT DELIMITED FIELDS TERMINATED BY '|' STORED AS TEXTFILE LOCATION '/user/guest/hdpappstudio/hive/hr';"

export SOLRURL=http://127.0.0.1:8983/solr/
export SOLRCORE=hr
export HBASETABLE=hr
export HBASECF=all
export HBASEROOTDIR=hdfs://127.0.0.1:8020/apps/hbase/data/
export ZOOKEEPERZNODEPARENT=/hbase-unsecure
export ZOOKEEPER=127.0.0.1:2181
export TOPIC=hr
export BROKDERLIST=sandbox:6667
export HIVETABLE=hr

echo Starting...

#echo Restarting Ambari-Server
#ambari-server restart

#echo Restarting Ambari-Agent
#ambari-agent restart

#echo Creating HBase Table: $HBASETABLE
#sudo -u hbase echo create \'$HBASETABLE\',\'all\' | hbase shell


#echo Stopping Kafka
#/opt/kafka/bin/kafka-server-stop.sh
#sleep 2 
#echo Starting Kafka
#nohup /opt/kafka/bin/kafka-server-start.sh /opt/kafka/config/server.properties >/opt/kafka/kafka.out 2>/opt/kafka/kafka.err </dev/null &
#sleep 10

#echo Creating Kafka Topic: $TOPIC
#/usr/hdp/2.2.0.0-2041/kafka/bin/kafka-topics.sh --create --zookeeper $ZOOKEEPER --replication-factor 1 --partitions 2 --topic $TOPIC

#cd banana
#: ${JAVA_HOME:=/usr/lib/jvm/java-1.7.0-openjdk.x86_64}
#export JAVA_HOME

#../apache-ant-1.9.4/bin/ant
#cp build/banana-*.war /opt/solr/solr/hdp/webapps/banana.war
#cp jetty-contexts/banana-context.xml /opt/solr/solr/hdp/contexts
#cd ..

cwd=$(pwd)
cd /opt/solr/solr/hdp
#echo Stoping Solr
#java -DSTOP.KEY=secret -DSTOP.PORT=8983 -jar start.jar --stop
#sleep 5

curl -u admin:admin -H "X-Requested-By:ambari" -i -X PUT -d '{"RequestInfo": {"context" :"Start Kafka via REST"}, "Body": {"ServiceInfo": {"state": "STARTED"}}}' http://127.0.0.1:8080/api/v1/clusters/Sandbox/services/KAFKA
curl -u admin:admin -H "X-Requested-By:ambari" -i -X PUT -d '{"RequestInfo": {"context" :"Start HBase via REST"}, "Body": {"ServiceInfo": {"state": "STARTED"}}}' http://127.0.0.1:8080/api/v1/clusters/Sandbox/services/HBASE
curl -u admin:admin -H "X-Requested-By:ambari" -i -X PUT -d '{"RequestInfo": {"context" :"Start Storm via REST"}, "Body": {"ServiceInfo": {"state": "STARTED"}}}' http://127.0.0.1:8080/api/v1/clusters/Sandbox/services/STORM

sleep 10
echo Starting Solr
nohup java -DSTOP.KEY=secret -jar start.jar >solr.out 2>solr.err </dev/null &
cd $cwd
sleep 30

echo Starting Tomcat
/opt/tomcat/bin/catalina.sh start

#echo Creating Hive Table: $HIVETABLE
#sudo -u hive echo $DDL | hive

#echo Deploying Storm topology
#cwd=$(pwd)
#storm jar $cwd/StormTopology/target/HDPAppStudioStormTopology-*-distribution.jar com.hortonworks.digitalemil.hdpappstudio.storm.Topology $APPNAME $ZOOKEEPER $SOLRURL$SOLRCORE/update/json?commit=false $HBASETABLE $HBASECF $TOPIC $HIVETABLE $HBASEROOTDIR $ZOOKEEPERZNODEPARENT $FIELDS
#
#echo Execute 
#echo tail -f /var/log/ambari-server/ambari-server.log
#echo and wait until you see your Ambari View being deployed \(might take a couple of minutes\). Then go to Ambari Web: http://127.0.0.1:8080/#/main/views 
