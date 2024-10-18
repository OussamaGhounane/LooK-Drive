document.getElementById('subscription_type').addEventListener('change', function () {
    const amountField = document.getElementById('amount');
    const subscriptionType = document.getElementById('subscription_type').value;

    let amount = 0;
    if (subscriptionType === '3 month') {
        amount = 2500;
    } else if (subscriptionType === '6 month') {
        amount = 4000;
    } else if (subscriptionType === '9 month') {
        amount = 7000;
    }

    amountField.value = amount;
})


function validateCardNumber(cardNumber) {
    const regex = /^[0-9]{13,19}$/;
    if (!regex.test(cardNumber)) {
        return false;
    }

    let sum = 0;
    let shouldDouble = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
}

// Fonction de validation de la date d'expiration (MM/AA)
function validateExpiryDate(expiryDate) {
    const regex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!regex.test(expiryDate)) return false;

    const today = new Date();
    const currentYear = today.getFullYear() % 100; // les deux derniers chiffres de l'année
    const currentMonth = today.getMonth() + 1; // mois actuel (0-indexed)

    const [month, year] = expiryDate.split('/');
    const expiryMonth = parseInt(month);
    const expiryYear = parseInt(year);

    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
        return false;
    }

    return true;
}

// Fonction de validation du CVV
function validateCVV(cvv) {
    const regex = /^[0-9]{3,4}$/; // CVV peut être 3 ou 4 chiffres
    return regex.test(cvv);
}


document.getElementById('confirmationForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const expiryInput = document.getElementById('expirydate').value;
    const [month, year] = expiryInput.split('/').map(Number);

    // Vérifier que le mois est compris entre 01 et 12
    if (month < 1 || month > 12) {
        alert("Veuillez entrer un mois valide (01-12).");
        event.preventDefault(); // Empêche la soumission du formulaire
        return;
    }
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Obtenir les deux derniers chiffres de l'année en cours
    const currentMonth = currentDate.getMonth() + 1; // getMonth() retourne les mois de 0 à 11

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        alert("La carte est déjà expirée.");
        event.preventDefault(); // Empêche la soumission du formulaire
        return;
    }

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value,
        password_confirmation: document.getElementById('password_confirmation').value,
        name_agency: document.getElementById('name_agency').value,
        adresse: document.getElementById('adresse').value,
        type: document.getElementById('subscription_type').value,
        amount: document.getElementById('amount').value,
        latitude: document.getElementById('latitude').value,
        longitude: document.getElementById('longitude').value,
        horaire_debut: document.getElementById('horaire_debut').value,
        horaire_fin: document.getElementById('horaire_fin').value
    }


    fetch('http://127.0.0.1:8000/api/preSubscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })

        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la soumission du formulaire');
            }
            return response.json();
        })


        .then(data => {
            Toastify({
                text: "Votre compte a été créé avec succès, accédez à votre portail d’administration en visitant ce lien",
                duration: 3000,
                gravity: "top",
                position: 'center',
                backgroundColor: "green",
                onClick: function () {
                    window.location.href = 'http://127.0.0.1:8000/login';
                }
            }).showToast();
        })
        .catch(error => {
            console.error('Error:', error);
            Toastify({
                text: "Erreur lors de la soumission.",
                duration: 3000,
                gravity: "top",
                position: 'center',
                backgroundColor: "red"
            }).showToast();
        });
});

function changeLanguage(lang) {
    fetch(lang + '.json')
        .then(response => response.json())
        .then(data => {
            document.querySelectorAll('[data-key]').forEach(element => {
                const key = element.getAttribute('data-key');
                element.textContent = data[key];
            });
        })
        .catch(error => console.error('Error:', error));
}


// Validation pour la première page


// document.getElementById('nextBtn').addEventListener('click', function (event) {
//     resetErrors();
//     let isValid = true;

//     // Validation du nom
//     const nom = document.getElementById('name');
//     if (nom.value.trim() === '') {
//         document.getElementById('nomError').style.display = 'block';
//         isValid = false;
//     }

//     // Validation de l'email
//     const email = document.getElementById('email');
//     if (!validateEmail(email.value)) {
//         document.getElementById('emailError').style.display = 'block';
//         isValid = false;
//     }

//     //

//     const phone = document.getElementById('phone');
//     if (!validatePhone(phone.value)) {
//         document.getElementById('phoneError').style.display = 'block';
//         isValid = false;
//     }

//     const adresse = document.getElementById('adresse');
//     if (adresse.value.trim() === '') {
//         document.getElementById('adresseError').style.display = 'block';
//         isValid = false;
//     }

//     const horaire_debut = document.getElementById('horaire_debut');
//     if (horaire_debut.value.trim() === '') {
//         document.getElementById('hrdError').style.display = 'block';
//         isValid = false;
//     }

//     const horaire_fin = document.getElementById('horaire_fin');
//     if (horaire_fin.value.trim() === '') {
//         document.getElementById('hrfError').style.display = 'block';
//         isValid = false;
//     }

//     const password = document.getElementById('password');
//     if (password.value.trim() === '') {
//         document.getElementById('passwordError').style.display = 'block';
//         isValid = false;
//     }

//     const password_confirmation = document.getElementById('password_confirmation');
//     if (password_confirmation.value.trim() === '') {
//         document.getElementById('password_confError').style.display = 'block';
//         isValid = false;
//     }

// });





