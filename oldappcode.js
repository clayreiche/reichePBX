 
		// Handle SIP Invites.
		if (trim(request.method) == 'INVITE') {
			//console.log(request);
			proxy.send(sip.makeResponse(request, 100, 'Trying'));
 
			// Look up the registration info. for the user being
			// called.
			address = sip.parseUri(request.uri);
			client.get("registration_" + context + "_" + address.user, function(err, register_data) {
				// If not found or error send to gateway or return 404.
				if (err) {										
					sys.puts('User ' + address.user + ' is not found');
					sip.send(sip.makeResponse(request, 404, 'Not Found'));
				}else if (register_data === null){
					// Send to PSTN at some point
					sys.puts('User ' + address.user + ' is not found');
					sip.send(sip.makeResponse(request, 404, 'Not Found'));				
					
					
				}
 
				// Otherwise, send redirect with contact URI.
				else {
					//console.log(register_data);
					var register_data = JSON.parse(register_data);					
					sys.puts('User ' + address.user
							+ ' is found at ' + register_data.headers.contact[0].uri);
					var response = sip.makeResponse(request, 302, 'Moved Temporarily');
					response.headers.contact = [ { uri : register_data.headers.contact[0].uri } ];
					proxy.send(response);
				}
			});
		}