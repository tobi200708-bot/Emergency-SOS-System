/* =====================================================
   CLOUD EMERGENCY SOS SYSTEM
   SCRIPT.JS
===================================================== */


import {
    saveSOSAlert
} from "./firebase.js";


// =====================================================
// ELEMENTS
// =====================================================

const sosButton =
    document.getElementById("sosButton");

const sosModal =
    document.getElementById("sosModal");

const confirmSOS =
    document.getElementById("confirmSOS");

const cancelSOS =
    document.getElementById("cancelSOS");

const statusMessage =
    document.getElementById("statusMessage");

const phoneNumber =
    document.getElementById("phoneNumber");

const menuToggle =
    document.getElementById("menuToggle");

const navMenu =
    document.getElementById("navMenu");


// =====================================================
// MOBILE MENU
// =====================================================

menuToggle.addEventListener(
    "click",
    () => {

        navMenu.classList.toggle(
            "active"
        );

    }
);


// =====================================================
// OPEN SOS MODAL
// =====================================================

sosButton.addEventListener(
    "click",
    () => {

        sosModal.style.display =
            "flex";

    }
);


// =====================================================
// CANCEL
// =====================================================

cancelSOS.addEventListener(
    "click",
    () => {

        sosModal.style.display =
            "none";

    }
);


// =====================================================
// CLOSE MODAL OUTSIDE
// =====================================================

sosModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target === sosModal
        ) {

            sosModal.style.display =
                "none";

        }

    }
);


// =====================================================
// GET CURRENT GPS LOCATION
// =====================================================

function getCurrentLocation() {

    return new Promise(
        (resolve, reject) => {

            if (
                !navigator.geolocation
            ) {

                reject(
                    new Error(
                        "GPS is not supported by this browser."
                    )
                );

                return;

            }


            navigator.geolocation.getCurrentPosition(

                (position) => {

                    const locationData = {

                        latitude:
                            position.coords.latitude,

                        longitude:
                            position.coords.longitude,

                        accuracy:
                            position.coords.accuracy

                    };


                    console.log(
                        "GPS Location:",
                        locationData
                    );


                    resolve(
                        locationData
                    );

                },


                (error) => {

                    let message =
                        "Unable to get location.";


                    if (
                        error.code === 1
                    ) {

                        message =
                            "Location permission denied.";

                    }


                    if (
                        error.code === 2
                    ) {

                        message =
                            "Location unavailable.";

                    }


                    if (
                        error.code === 3
                    ) {

                        message =
                            "GPS request timed out.";

                    }


                    reject(
                        new Error(message)
                    );

                },


                {

                    enableHighAccuracy:
                        true,

                    timeout:
                        20000,

                    maximumAge:
                        0

                }

            );

        }
    );

}


// =====================================================
// OPEN SMS
// =====================================================

function openSMS(
    phone,
    latitude,
    longitude
) {

    const mapLink =
        `https://www.google.com/maps?q=${latitude},${longitude}`;


    const message =
`🚨 EMERGENCY SOS ALERT 🚨

I need emergency help.

📍 My current location:
${mapLink}

Please contact me immediately.`;


    const smsURL =
        `sms:${phone}?body=${encodeURIComponent(message)}`;


    window.location.href =
        smsURL;

}


// =====================================================
// CONFIRM SOS
// =====================================================

confirmSOS.addEventListener(
    "click",
    async () => {

        try {

            // =========================================
            // CHECK PHONE
            // =========================================

            const phone =
                phoneNumber.value.trim();


            if (!phone) {

                alert(
                    "Please enter emergency contact number."
                );

                phoneNumber.focus();

                return;

            }


            // =========================================
            // DISABLE BUTTON
            // =========================================

            confirmSOS.disabled =
                true;


            sosButton.disabled =
                true;


            confirmSOS.textContent =
                "GETTING LOCATION...";


            statusMessage.textContent =
                "📍 Getting GPS location...";


            // =========================================
            // GET LOCATION
            // =========================================

            const location =
                await getCurrentLocation();


            statusMessage.textContent =
                "📍 GPS location detected.";


            console.log(
                "Location received:",
                location
            );


            // =========================================
            // FIREBASE
            // =========================================

            confirmSOS.textContent =
                "SAVING ALERT...";


            statusMessage.textContent =
                "☁️ Saving emergency alert to cloud...";


            const alertId =
                await saveSOSAlert(
                    location
                );


            console.log(
                "Firebase Alert ID:",
                alertId
            );


            // =========================================
            // SUCCESS
            // =========================================

            statusMessage.textContent =
                "🚨 Emergency alert saved successfully!";


            confirmSOS.textContent =
                "SOS SENT ✓";


            sosModal.style.display =
                "none";


            // =========================================
            // OPEN SMS
            // =========================================

            setTimeout(
                () => {

                    openSMS(

                        phone,

                        location.latitude,

                        location.longitude

                    );

                },
                500
            );


        }

        catch (error) {

            console.error(
                "SOS ERROR:",
                error
            );


            statusMessage.textContent =
                "Unable to send SOS.";


            alert(
                "SOS ERROR\n\n" +
                error.message
            );


            confirmSOS.disabled =
                false;


            sosButton.disabled =
                false;


            confirmSOS.textContent =
                "YES, SEND SOS";

        }

    }
);
