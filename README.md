# RPi Tester
This is a tool created to test the conection of the [RPi Proxy](https://github.com/e-lab-FREE/RPi_Proxy) to the main server.

## Requirements

```
pip3 install flask
``` 
```
pip3 install flask_cors
```

## About 
This is to simulate the main server [FREE_Web](https://github.com/e-lab-FREE/FREE_Web) by sending and reciving the same message of it. 
This tool was development for the World Pendulum so it can only configure a RPi Proxy that is conected to a pendulum, but the user have to make sure that the configuration info is corrected, in other words is needed to edit the `Config/WP_LIS_IST.json` or add a new configuration file (.json).

The variable that need to be modifei are the [experiment][config][id] and [experiment][config][serial_port].
```json
{
  "experiment": {
    "name": "Pendulum",
    "description": "...description..."
    "config": {
      "id": "WP_LIS_IST",
      "serial_port": {
        "ports_restrict": [
          "/dev/ttyAMA0"
        ],
        "baud": "115200",
        "numbits": "8",
        "stopbits": "1",
        "partitybits": "0",
        "listening_timeout": "100000",
        "death_timeout": "10000000"
      },
      (...)
}
```
