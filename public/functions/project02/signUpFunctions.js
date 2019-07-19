
let uniqueUsername = false;

function checkUsername() {
    $.post("/project02/isUniqueUsername", {username: $("#username").val()}, function(returnedInfo) {
        if (returnedInfo.isUniqueUsername == true) {
            uniqueUsername = true;
            document.getElementById("usernameError").innerHTML = "";
        }
        else {
            uniqueUsername = false;
            document.getElementById("usernameError").innerHTML = "**This username is already in use!! Choose another**";
        }
    });
}

function checkPasswordsMatch()
{
    var pswrd = document.getElementById('pswrd').value;
    var vPswrd = document.getElementById("verifyPswrd").value;

    if (pswrd != vPswrd)
    {
        document.getElementById("pswrdError1.1").innerHTML = "**Passwords do not match**";
        document.getElementById("pswrdError2").innerHTML = "**Passwords do not match**";
        return false;
    }
    else
    {
        document.getElementById("pswrdError1.1").innerHTML = "";
        document.getElementById("pswrdError2").innerHTML = "";
        return true;
    }
}

function hasNumber(myString) 
{
    return /\d/.test(myString);
}

function checkCharacters()
{
    var pswrd = document.getElementById('pswrd').value;

    if (!hasNumber(pswrd) || pswrd.length < 7)
    {
        document.getElementById("pswrdError1.0").innerHTML = "**Password must contain seven characters and a number**";
        return false;
    }
    else
    {
        document.getElementById("pswrdError1.0").innerHTML = "";
        return true;
    }
}

function validate()
{
    if (checkCharacters() && checkPasswordsMatch() && uniqueUsername == true)
        return true;
    else
        return false;
}