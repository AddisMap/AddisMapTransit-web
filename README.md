# AddisMapTransit web

AddisMapTransit web is an [OTP react redux instance](https://github.com/opentripplanner/otp-react-redux) for Addis Ababa, Ethiopia.

## Acknowledgements

* Thanks for [komoot.de](https://komoot.de/) for providing the [Photon geocoder free of charge](https://photon.komoot.io/).
* Thanks to all OTP and OTP react redux developers
* Thanks to [our sponsors](https://github.com/AddisMap/AddisMapTransit#sponsors)

## Development

All features/fixes we develop are usually directly contributed to upstream.

So this repo only contains

* A dockerfile to build the image for hosting on https://web.addismaptransit.com/
* The configuration running there

### Local build

```bash
docker build . -t addismaptransitweb-local
docker run -p 8080:80 addismaptransitweb-local
```

Access http://localhost:8080/

### Build for the server

We use GitHub actions to build the docker image on the main branch.

### Update on the webserver

* ssh into server
* `cd /srv/addismaptransit-web`
* `docker-compose pull`
