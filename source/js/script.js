var conn = new WebSocket('ws://' + websocket_server.host + ":" + websocket_server.port);

conn.onopen = function(e) {
	console.log("Connect to server " + websocket_server.host + ":" + websocket_server.port +  " successfully !");
	$('#msg-list').append("<p style='text-align:center;'>Kết nối đến máy chủ thành công !</p>");
	setTimeout(function () {
		$('#msg-list').load("/source/socket/load_msg.php");
		scrollChat();
	}, 500);
};

conn.onmessage = function(e) {
	$('#non-msg').remove();

	$('#msg-list').append(`
	<div class="msg-box">
        ${e.data}
    </div>
	`);

	scrollChat();
};

$(document).ready(function () {
	scrollChat();

	$('#msg-send').submit(function (e) {
		e.preventDefault();

		if ($('#msg-sendbox').val() != "") {
			let msg = $('#msg-sendbox').val();

			// replace html
			msg = msg.replace("<", "&lt;");
			msg = msg.replace(">", "&gt;");

			conn.send(`
				<p><strong class="msg-box-user ${$('#user_session').val()}">${$('#user_session').val()} :</strong> ${msg}</p>
			`);

			$.ajax({
				type: "POST",
				url: "/source/socket/add_msg.php",
				data: {
					username: $('#user_session').val(),
					message: msg
				},
				dataType: 'json',
				success: function (response) {
					if (response.status != "thanhcong") {
						alert("An error has occurred !");
					} else {
						console.log("Send " + msg + " success !");
					}
				},
				error: function (error) {
					console.log(error);
				}
			});

			$('#msg-sendbox').val("");
			$('#msg-sendbutton').prop('disabled', !0);
		}
	});
});

function scrollChat() {
	// let _element = document.getElementById("msg-list");
	// _element.scrollTop = _element.scrollHeight;

	$('#msg-list').animate({ scrollTop: $(document).height() }, "slow");
	return true;
}

function checkMsg(input) {
	if ($(input).val() != "") {
		$('#msg-sendbutton').prop('disabled', !1);
	} else {
		$('#msg-sendbutton').prop('disabled', !0);
	}
}