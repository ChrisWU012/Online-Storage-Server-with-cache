$(function () {
  $.ajax({
    url: `http://localhost:8000/file-list`,
    method: "GET",
  })
    .done(function (data) {
      console.log("data : " + data);
      data.map((e) => {
        $("span").append(`
          <li>${e}
           <form action="/download/${e}" enctype="multipart/form-data" method="GET">
            <button type="submit" class="btn btn-info">Download</button>
           </form>
          </li>`);
      });
    })
    .fail(function (data) {
      console.log("Failed to connect: " + JSON.stringify(data));
    })
    .always(function (data) {
      console.log("Checking $.ajax: " + JSON.stringify(data));
    });
});

getData();
