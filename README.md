# velsta_interview 

This a coding test challenge for backend software developer for velsta company.

1. If you have xampp/wamp/laragon installed in your system, create a new database and name it velsta_interview. You will import the sql file into the newly created database 

2.  Run docker build -t company name or anything you want to build the docker image 

3. If you have node installed already just clone the repo, in the directory and run npm install. This should install the node modules. then run npm start to start up the node server or run docker run -p 8080 {image name} . (the dot is the current directory) to run the app.

4. Check the log.txt file for the logs on the drones battery


## Create Drone 

### Request: POST 
#### parameters:
 sNum (for serial Number)
 model
 battery_Cap
> link  http://localhost:8080/api/test/drone 

### Request: GET 
Get a single drone with medications
> link http://localhost:8080/api/test/drone/{id}
{The id is the drones id}


### Request: GET 
Get all drones available for flight
> link http://localhost:8080/api/test/drone 

### Request: GET 
GET battery capacity of a specific drone
> link http://localhost:8080/api/test/droneBattery/{id}
{the id is the drone's id}

## Create Medication for drones 

### Request: POST
#### parameters 
drone_id
name 
weight
code
> link http://localhost:8080/api/test/medication





