const generateBtn = document.getElementById('generate');
const copyBtn = document.getElementById('copy');
const passwordText = document.getElementById('password');
const uppercaseCheckbox = document.getElementById('uppercase');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const specialCharsCheckbox = document.getElementById('specialChars');
const customSpecialCharsInput = document.getElementById('customSpecialChars');
const passwordLengthInput = document.getElementById('passwordLength');

function generatePassword() {
    let passwordLength = parseInt(passwordLengthInput.value);
    if (passwordLength < 8 || passwordLength > 128) {
        alert("Password length must be between 8 and 128 characters.");
        return;
    }

    let uppercaseABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let lowercaseABC = "abcdefghijklmnopqrstuvwxyz";
    let numeric = "0123456789";
    let specialSymbols = "@#$%^&*()?.<\>|=+:;,[-_]";
    if (customSpecialCharsInput.value) {
        specialSymbols += customSpecialCharsInput.value;
    }

    let multiSelect = '';
    if (uppercaseCheckbox.checked) multiSelect += uppercaseABC;
    if (lowercaseCheckbox.checked) multiSelect += lowercaseABC;
    if (numbersCheckbox.checked) multiSelect += numeric;
    if (specialCharsCheckbox.checked) multiSelect += specialSymbols;

    if (!multiSelect) {
        alert("At least one character type must be selected.");
        return;
    }

    let finalPassword = '';
    for (let i = 0; i < passwordLength; i++) {
        let rng = Math.floor(Math.random() * multiSelect.length);
        finalPassword += multiSelect[rng];
    }

    // Ensure the password contains at least one character from each selected category
    if (uppercaseCheckbox.checked && !finalPassword.match(/[A-Z]/)) {
        finalPassword = finalPassword.slice(0, -1) + getRandomChar(uppercaseABC);
    }
    if (lowercaseCheckbox.checked && !finalPassword.match(/[a-z]/)) {
        finalPassword = finalPassword.slice(0, -1) + getRandomChar(lowercaseABC);
    }
    if (numbersCheckbox.checked && !finalPassword.match(/[0-9]/)) {
        finalPassword = finalPassword.slice(0, -1) + getRandomChar(numeric);
    }
    if (specialCharsCheckbox.checked && !finalPassword.match(/[@#$%^&*()?.<\>|=+:;,[-_]/)) {
        finalPassword = finalPassword.slice(0, -1) + getRandomChar(specialSymbols);
    }

    return finalPassword;
}

function getRandomChar(charSet) {
    return charSet[Math.floor(Math.random() * charSet.length)];
}

function writePassword() {
    let password = generatePassword();
    if (password) {
        passwordText.value = password;
    }
}

function copyPassword() {
    if (passwordText.value) {
        navigator.clipboard.writeText(passwordText.value)
            .then(() => alert('Password copied to clipboard'))
            .catch(err => alert('Could not copy password: ', err));
    }
}

generateBtn.addEventListener("click", writePassword);
copyBtn.addEventListener("click", copyPassword);
