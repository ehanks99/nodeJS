function login() {
	var username = $("#username").val();
	var password = $("#password").val();

	var params = {
		username: username,
		password: password
	};

	$.post("/team-activity12/login", params, function(result) {
        console.log("in the function call");
		if (result && result.success) {
			$("#status").text("Successfully logged in.");
		} else {
			$("#status").text("Error logging in.");
		}
	});
}

function logout() {
	$.post("/team-activity12/logout", function(result) {
		if (result && result.success) {
			$("#status").text("Successfully logged out.");
		} else {
			$("#status").text("Error logging out.");
		}
	});
}

function getServerTime() {
	$.get("/team-activity12/getServerTime", function(result) {
		if (result && result.success) {
			$("#status").text("Server time: " + result.time);
		} else {
			$("#status").text("Got a result back, but it wasn't a success. Your reponse should have had a 401 status code.");
		}
	}).fail(function(result) {
		$("#status").text("Could not get server time.");
	});
}