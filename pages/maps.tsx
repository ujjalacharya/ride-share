import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";

import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  Autocomplete,
  DirectionsRenderer,
  InfoWindowF,
  Marker,
} from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";

// const center = { lat: 50.5513197, lng: 9.6915065 };

const Maps = ({ getDrivers, setNearbyDrivers, nearbyDrivers }: any) => {
  const { isLoaded }: any = useJsApiLoader({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const [map, setMap] = useState<any>(/** @type google.maps.Map */ null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [center, setCenter] = useState({ lat: 50.5558, lng: 9.6808 });

  const [activeMarker, setActiveMarker] = useState(null);

  const handleActiveMarker = (marker: any) => {
    if (marker !== activeMarker) {
      // return;
      setActiveMarker(marker);
    }
  };

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef: any = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef: any = useRef();

  const showPosition = (position: any) => {
    if (position?.coords?.latitude && position?.coords?.longitude) {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  if (!isLoaded) {
    return <SkeletonText />;
  }

  async function calculateRoute() {
    if (
      originRef?.current?.value === "" ||
      destiantionRef?.current?.value === ""
    ) {
      return;
    }
    const currentDest = originRef?.current?.value?.split(",")?.[0];
    getDrivers(currentDest, setNearbyDrivers);
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results: any = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results?.routes[0]?.legs[0]?.distance?.text);
    setDuration(results?.routes[0]?.legs[0]?.duration?.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    setNearbyDrivers([]);
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }

  console.log(directionsResponse);

  return (
    <>
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map: any) => setMap(map)}
        >
          {/* <MarkerF position={center} /> */}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}

          {nearbyDrivers?.length > 0 &&
            nearbyDrivers.map(
              ({
                id,
                firstName,
                lastName,
                currentLocation,
                currentLocationLat,
                currentLocationLong,
              }: any) => {
                return (
                  <MarkerF
                    key={id}
                    position={{
                      lat: parseFloat(currentLocationLong),
                      lng: parseFloat(currentLocationLat),
                    }}
                    onClick={() => handleActiveMarker(id)}
                  >
                    {activeMarker === id && (
                      <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                        <div>
                          <div>
                            <b>Driver Name: </b>
                            {firstName} {lastName}
                          </div>
                          <div>
                            <b>Driver Location: </b>
                            {currentLocation}
                          </div>
                        </div>
                      </InfoWindowF>
                    )}
                  </MarkerF>
                );
              }
            )}
        </GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius="lg"
        m={4}
        bgColor="white"
        shadow="base"
        minW="400px"
        zIndex="1"
      >
        <VStack spacing={2} justifyContent="space-between">
          <Text pb="2" fontSize="xl" fontWeight="bold">
            Find A Ride
          </Text>
          <Box width="100%">
            <Autocomplete>
              <Input type="text" placeholder="Origin" ref={originRef} />
            </Autocomplete>
          </Box>
          <Box width="100%">
            <Autocomplete>
              <Input
                type="text"
                placeholder="Destination"
                ref={destiantionRef}
              />
            </Autocomplete>
          </Box>

          <ButtonGroup>
            <Button colorScheme="green" type="submit" onClick={calculateRoute}>
              Find Drivers
            </Button>
            <IconButton
              aria-label="center back"
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </VStack>
        <HStack spacing={4} mt={4} justifyContent="space-between">
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <IconButton
            aria-label="center back"
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map?.panTo(center);
              map?.setZoom(15);
            }}
          />
        </HStack>
      </Box>
    </>
  );
};

export default Maps;
