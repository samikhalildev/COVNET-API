/* Set the width of the side navigation to 250px */

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}

$(() => {
  $("#userForm").submit(event => {
    event.preventDefault(); // prevent page refresh
    const inputUserId = $("#userInfo").val(); // take infected user id
    console.log(inputUserId);
    $("#userInfo").val("");
    
    let API = "/api/infections/infectedId";

    const options = {
      method: "POST",
      headers: { 
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({infectedId: inputUserId }),
    };

    fetch(API, options)
      .then(res => res.json())
      .then(response => {

        console.log(response);
        if (response && response.success) {
          $("#feedback").text("The system will now capture the user locations from the past 2 weeks and notify others who may be at risk.").css({ color: 'green'});
        } else {
          $("#feedback").text(`${response && response.err ? response.err : response}`).css({ color: 'red' });
        }
      })
      .catch(err => {
        $("#feedback").text("Failed trying to send ID to the server").css({ color: 'red' });
        console.log(err);
      });
  });
});
