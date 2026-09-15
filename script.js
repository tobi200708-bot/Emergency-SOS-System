import { saveSOSAlert } from "./firebase.js";


document.addEventListener("DOMContentLoaded", () => {

    const sosButton =
        document.getElementById("sosButton");

    const statusMessage =
        document.getElementById("statusMessage");

    const locationStatus =
        document.getElementById("locationStatus");


    sosButton.addEventListener("click", () => {

        sendEmergencySOS();

    });


    function sendEmergencySOS() {

        statusMessage.textContent =
            "🚨 Emergency SOS activated...";

        locationStatus.textContent =
            "📍 Getting your location...";

        sosButton.disabled = true;

        if (!navigator.geolocation) {

            statusMessage.textContent =
                "GPS is not supported by this browser.";

            sosButton.disabled = false;

            return;
        }


        navigator.geolocation.getCurrentPosition(

            async (position) => {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                const accuracy =
                    position.coords.accuracy;


                locationStatus.textContent =
                    `📍 Location detected:
                    ${latitude}, ${longitude}`;


                try {

                    const alertId =
                        await saveSOSAlert(
                            latitude,
                            longitude,
                            accuracy
                        );


                    statusMessage.textContent =
                        "✅ Emergency alert successfully sent to cloud.";

                    locationStatus.innerHTML =
                        `📍 GPS Location:<br>
                        Latitude: ${latitude}<br>
                        Longitude: ${longitude}<br>
                        Accuracy: ${Math.round(accuracy)} meters<br><br>
                        🆔 Alert ID: ${alertId}`;


                    // Open Google Maps
                    const mapURL =
                        `https://www.google.com/maps?q=${latitude},${longitude}`;

                    window.open(mapURL, "_blank");


                } catch (error) {

                    console.error(error);

                    statusMessage.textContent =
                        "❌ Failed to save emergency alert.";

                    locationStatus.textContent =
                        "Please check Firebase configuration and Firestore rules.";

                }


                sosButton.disabled = false;

            },


            (error) => {

                console.error(error);


                statusMessage.textContent =
                    "❌ Unable to get your location.";


                if (error.code === 1) {

                    locationStatus.textContent =
                        "Location permission was denied.";

                } else if (error.code === 2) {

                    locationStatus.textContent =
                        "Location is unavailable.";

                } else if (error.code === 3) {

                    locationStatus.textContent =
                        "Location request timed out.";

                } else {

                    locationStatus.textContent =
                        "Unknown location error.";

                }


                sosButton.disabled = false;

            },

            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }

        );

    }

});
