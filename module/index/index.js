$(document).ready(() => {
  row = $(`#limit_row`).val();
  serch();
});
$(document).on(`change`, `#limit_row`, () => {
  row = $(`#limit_row`).val();
  serch();
});
$(document).on(`click`, `.fliter`, () => {
  $(`.fliter-modal`).slideToggle(300);
});
$(document).on(`click`, `#Serch`, () => {
  serch();
});
var show = 1;
var showpage = 5;
var page = 1;
var row = 25;
var totalpage = 0;
var limit = 5;
var data;
var checked = [];
var CurrentPage = 1;
var sortArr = [];
function serch() {
  var check = [];
  $("#statusCheck:checked").each(function () {
    var value = $(this).val();
    if (!isNaN(value) && value.length === 3) {
      check.push(value);
    } else {
      ErrorTime(1500, "Data exits !!", false);
      return;
    }
  });
  var val = $(`#serVal`).val();
  if (val !== "" && checkChar("Allmail", val) == false) {
    inValid($(`#serVal`));
    return;
  } else {
    reValid($(`#serVal`));
  }
  var datef = $("#date-f").val().replace("T", " ");
  var datel = $("#date-l").val().replace("T", " ");
  if (datef !== "" && datel == "") {
    inValid($(`#date-l`));
    return;
  } else if (datef == "" && datel !== "") {
    inValid($(`#date-f`));
    return;
  } else {
    datef = datef.split(" ").filter(Boolean);
    datel = datel.split(" ").filter(Boolean);
    reValid($(`#date-l`));
  }

  var arr = { check, val, datef, datel, sortArr };
  render(arr, page);
}
$(document).on("click", `#sortData`, function () {
  var val = $(this).data("val");
  if (sortArr.length > 0) {
    var found = false;
    for (var i = 0; i < sortArr.length; i++) {
      if (sortArr[i].type === val) {
        found = true;
        if (sortArr[i].sort === "ASC") {
          sortArr[i].sort = "DESC";
          $(this).html(`${val} <i class="fa-solid fa-sort-up"></i>`);
        } else if (sortArr[i].sort === "DESC") {
          sortArr.splice(i, 1);
          $(this).html(`${val} <i class="fa-solid fa-sort"></i>`);
          i--;
        }
      }
    }
    if (!found) {
      sortArr.push({ type: val, sort: "ASC" });
      $(this).html(`${val} <i class="fa-solid fa-sort-down"></i>`);
    }
  } else {
    sortArr.push({ type: val, sort: "ASC" });
    $(this).html(`${val} <i class="fa-solid fa-sort-down"></i>`);
  }
  serch();
});
function render(arr, page) {
  $(`#tbody`).html("");
  $(`.loaderFrame`).html(`<span class="loader"></span>`).show();
  $.ajax({
    url: "API/fetch",
    method: "POST",
    contentType: "application/JSON",
    dataType: "JSON",
    data: JSON.stringify({
      serch: arr,
      page: page,
      limit: row,
    }),
  })
    .done((res) => {
      if (res.status == false) {
        ErrorTime(1500, "Server Error !!", false);
      } else if (res.data.length == 0) {
        emptyData();
      } else {
        totalpage = res.total;
        data = res.data;
        insert(data);
      }
    })
    .fail((err) => {
      ErrorTime(1500, "Server Error !!", false);
      return;
    });
}
function emptyData() {
  var html = "";
  html += `
<p class="emptyText">No Data</p>
`;
  $(`.loaderFrame`).html(html);
}
function insert(Data) {
  $(`#checkAll`).prop("checked", false);
  var res = Data;
  var html = "";
  for (var i = 0; i < res.length; i++) {
    html += `
<tr>
<th><input type="checkbox" id="check" class="check" data-id="${i}"></th>
<th class="treeFlex">
`;
    if (res[i].avatar !== "false") {
      html += `<img src="file/avatar/${res[i].avatar}" alt="">`;
    } else {
      html += `<img src="file/userinvalid.png" alt="">`;
    }
    html += `
<div>
<span>${res[i].username}</span>
<span class="sm">${res[i].email}</span>
</div>
</th>
<th class="pass">
<i class="fa-solid fa-circle"></i><i class="fa-solid fa-circle"></i><i class="fa-solid fa-circle"></i><i class="fa-solid fa-circle"></i><i class="fa-solid fa-circle"></i><i class="fa-solid fa-circle"></i><i class="fa-solid fa-circle"></i><i class="fa-solid fa-circle"></i><i class="fa-solid fa-circle"></i><i class="fa-solid fa-circle"></i>
</th>
<th>${res[i].phone}</th>
<th class="TwoFlex">
<p>${res[i].Date}</p><span>${res[i].Time}</span>
</th>`;

    switch (res[i].status) {
      case "100":
        html += `<th class="status admin"><i class="fa-solid fa-circle"></i> Admin</th>`;
        break;
      case "200":
        html += `<th class="status member"><i class="fa-solid fa-circle"></i> Member</th>`;
        break;
      case "300":
        html += `<th class="status ban"><i class="fa-solid fa-circle"></i> Ban</th>`;
        break;
    }

    html += `
<th class="btn-f">
<button id="edit" data-id="${i}"><i class="fa-regular fa-pen-to-square"></i></button>
<button id="info" data-id="${i}"><i class="fa-regular fa-eye"></i></button>
<button id="delete" data-id="${i}"><i class="fa-regular fa-trash-can"></i></button>
</th>
</tr>`;
  }
  var pagination = "";
  if (page !== 1) {
    pagination += `<li><button id="Cupage_re"><i class="fa-solid fa-chevron-left"></i></button></li>`;
  }
  if (showpage > totalpage) {
    showpage = totalpage;
  }
  for (var i = show; i <= showpage; i++) {
    pagination += ` <li><button id="Cupage" data-page="${i}">${i}</button></li>`;
  }
  if (page !== totalpage) {
    pagination += `<li><button id="Cupage_add"><i class="fa-solid fa-chevron-right"></i></button></li>`;
  }
  $(`.loaderFrame`).html("").hide();
  $(`#tbody`).html(html);
  $(`#Cupage`).html(page);
  $(`#Totalpage`).html(totalpage);
  $(`#pagi`).html(pagination);
  $(`#Cupage[data-page="${page}"]`).addClass("active");
  $(`.pagination`).fadeIn(250);
  loadChecked();
}
function loadChecked() {
  var amount = 0;
  for (var i = 0; i < data.length; i++) {
    var index = data[i].ID; 
    var indexOfItem = -1;
    for (var j = 0; j < checked.length; j++) {
      if (checked[j].index === index) {
        indexOfItem = j;
        break;
      }
    }
    if (indexOfItem !== -1) {
      amount++;
      $(`#check[data-id="${i}"]`).prop("checked", true);
    }
  }
  if (amount == data.length) {
    $(`#checkAll`).prop("checked", true);
  }
}
$(document).on(`click`, `#check`, function () {
  var index = $(this).data("id");
  index = data[index].ID;
  if ($(this).prop("checked")) {
    checked.push({
      index,
      data: data[index],
    });
  } else {
    var indexOfItem = checked.indexOf(index);
    if (indexOfItem !== -1) {
      checked.splice(indexOfItem, 1);
    }
  }

  var checkedCount = $('input[type="checkbox"][id^="check"]:checked').length;
  if (checkedCount == data.length) {
    $(`#checkAll`).prop("checked", true);
  } else {
    $(`#checkAll`).prop("checked", false);
  }
});
$(document).on("click", "#checkAll", function () {
  if ($(this).prop("checked")) {
    for (var i = 0; i < data.length; i++) {
      index = data[i].ID;
      var indexOfItem = checked.indexOf(index);
      if (indexOfItem == -1) {
        checked.push({
          index,
          data: data[i],
        });
      }
    }
    $('input[type="checkbox"][id^="check"]').prop("checked", true);
  } else {
    for (var i = 0; i < data.length; i++) {
      index = data[i].ID;
      var indexOfItem = checked.indexOf(index);
      if (indexOfItem !== -1) {
        checked.splice(indexOfItem, 1);
      }
    }
    $('input[type="checkbox"][id^="check"]').prop("checked", false);
  }
});
function checkpage(cu_page) {
  show = 0;
  showpage = Math.round(cu_page / 10) * 10;
  limit = showpage;
  page = cu_page;
  if (showpage == 0) {
    showpage = showpage + 5;
    show = showpage - 5 + 1;
  } else if (page == limit) {
    showpage = showpage + 5;
    show = showpage - 5 - 1;
  } else {
    show = showpage - 6;
  }
  if (showpage > totalpage) {
    showpage = totalpage;
  }

  if (page > showpage) {
    showpage = showpage + 5;
    show = showpage - 6;
  }
}
$(document).on(`click`, `#Cupage`, function (e) {
  page = $(this).data("page");
  if (page == CurrentPage) {
    return;
  }
  if (page == totalpage) {
    CurrentPage = page;
    serch();
    return;
  }
  CurrentPage = page;
  checkpage(page);
  serch();
});
$(document).on(`click`, `#Cupage_add`, function (e) {
  if (page == totalpage) {
    return;
  }
  page = page + 1;
  if (page == totalpage) {
    CurrentPage = page;
    serch();
    return;
  }
  checkpage(page);
  CurrentPage = page;
  serch();
});
$(document).on(`click`, `#Cupage_re`, function (e) {
  if (page == 1) {
    return;
  }
  page = page - 1;
  CurrentPage = page;
  checkpage(page);
  serch();
});
var inp = 0;
var limit_inp = 10;
var Addarr = [];
function Addform() {
  var html = "";
  html += `
<div class="form-contain" data-index="${inp}">
<div class="leftf">
<div class="inp-t">
<div>
<i class="fa-regular fa-user"></i>
<input class="form-control" id="a_username"  data-index="${inp}" type="text" placeholder="Username">
</div>
<div>
<i class="fa-solid fa-id-badge"></i>
<select class="form-select" id="a_status"  data-index="${inp}">
<option value="500" selected disabled>Status</option>
<option value="100">Admin</option>
<option value="200">Member</option>
<option value="300">Ban</option>
</select>
</div>
</div>
<div class="inp-t">
<div>
<i class="fa-regular fa-envelope"></i>
<input class="form-control" type="text" id="a_email"  data-index="${inp}" placeholder="Email">
</div>
<div>
<i class="fa-solid fa-phone"></i>
<input class="form-control" type="text" id="a_phone"  data-index="${inp}" placeholder="Phone">
</div>
</div>
<div class="inp-t">
<div>
<i class="fa-regular fa-calendar-days"></i>
<input class="form-control" type="date" id="a_date"  data-index="${inp}" placeholder="Date">
</div>
<div>
<i class="fa-regular fa-clock"></i>
<input class="form-control" type="time" id="a_time"  data-index="${inp}" placeholder="Time">
</div>
</div>
<div class="inp-t">
<div>
<i class="fa-regular fa-eye-slash"></i>
<input class="form-control" type="password" id="a_pass"  data-index="${inp}" placeholder="Password">
</div>
<div>
<i class="fa-regular fa-eye-slash"></i>
<input class="form-control" type="password" id="a_conpass"  data-index="${inp}" placeholder="Confirm Password">
</div>
</div>`;
  if (inp !== 0) {
    html += `<button type="button" class="btnDeleFrom" id="delForm" data-index="${inp}"><i class="fa-regular fa-trash-can"></i> Delete</button>`;
  }
  html += `
</div>
<div class="rightf">
<div class="profile">
<div class="bg"></div>
<div class="contain">
<img id="Imgpro" data-index="${inp}" src="file/userinvalid.png" alt="">
</div>
<div class="input-con">
<button class="open-file">
<span class="file-wrapper">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 71 67">
<path stroke-width="5" stroke="black"
d="M41.7322 11.7678L42.4645 12.5H43.5H68.5V64.5H2.5V2.5H32.4645L41.7322 11.7678Z">
</path>
</svg>
<span class="file-front"></span>
</span>
Upload Profile
<input id="a_avatar"  data-index="${inp}" class="inpBtn form-control" type="file" accept=".png,.jpeg,.webp,.jpg">
</button>
</div>
</div>
</div>
</div>
`;
  Addarr.push(inp);
  inp++;
  $(`#form_Add`).append(html);
}
$(document).on(`click`, `#delForm`, function () {
  var Remove = $(this).data("index");
  var index = Addarr.indexOf(Remove);
  if (index !== -1) {
    Addarr.splice(index, 1);
  }
  $(`.form-contain[data-index="${Remove}"`).remove();
});
$(document).on(`click`, `.plus`, () => {
  Addform();
  var html = "";
  html += `
  <button type="button" id="AddInp" class="btnAddM"><i class="fa-solid fa-plus"></i> Add more</button>
  <button type="button" id="AddData" class="btnAdd"><i class="fa-solid fa-plus"></i> Add Data</button>
  <button type="button" id="CancelAdd" class="btncanCel"><i class="fa-solid fa-rotate-left"></i> Back</button>
  `;
  $(`.button-contain`).html(html);
  $(`.textF`).html(`Add customer`);
  $(`.table-f`).fadeOut(250, () => {
    $(`.add-f`).fadeIn(250);
  });
});
$(document).on(`click`, `#AddInp`, () => {
  if (Addarr.length == limit_inp) {
    ErrorTime(1500, "Data limit 10 !!", false);
    return;
  }
  Addform();
});
$(document).on(`click`, `#CancelAdd`, () => {
  $(`.add-f`).fadeOut(250, () => {
    $(`.button-contain`).html("");
    $(`#form_Add`).html("");
    inp = 0;
    Addarr = [];
    $(`.table-f`).fadeIn(250);
  });
});
$(document).on(`click`, `#AddData`, () => {
  var reqArr = [];
  if (Addarr.length !== 0) {
    var sta = false;
    for (var i = 0; i < Addarr.length; i++) {
      var index = Addarr[i];
      if ($(`.form-contain[data-index="${index}"]`)) {
        var username = $(`#a_username[data-index="${index}"]`).val();
        var email = $(`#a_email[data-index="${index}"]`).val();
        var phone = $(`#a_phone[data-index="${index}"]`).val();
        var status = $(`#a_status[data-index="${index}"]`).val();
        var time = $(`#a_time[data-index="${index}"]`).val();
        var date = $(`#a_date[data-index="${index}"]`).val();
        var pass = $(`#a_pass[data-index="${index}"]`).val();
        var conpass = $(`#a_conpass[data-index="${index}"]`).val();
        var allow = [100, 200, 300];
        var file = $(`#a_avatar[data-index="${index}"]`);
        file = file[0].files;
        if (file.length == 0) {
          file = false;
        } else {
          file = file[0];
        }
        if (checkChar("All", username) == false || username == "") {
          sta = true;
          inValid($(`#a_username[data-index="${index}"]`));
        } else {
          reValid($(`#a_username[data-index="${index}"]`));
        }
        if (!allow.includes(parseInt(status))) {
          sta = true;
          inValid($(`#a_status[data-index="${index}"]`));
        } else {
          reValid($(`#a_status[data-index="${index}"]`));
        }
        if (checkEmail(email) == false || email == "") {
          sta = true;
          inValid($(`#a_email[data-index="${index}"]`));
        } else {
          reValid($(`#a_email[data-index="${index}"]`));
        }
        if (
          checkChar("num", phone) == false ||
          phone == "" ||
          phone.length !== 10
        ) {
          sta = true;
          inValid($(`#a_phone[data-index="${index}"]`));
        } else {
          reValid($(`#a_phone[data-index="${index}"]`));
        }
        if (date == "") {
          sta = true;
          inValid($(`#a_date[data-index="${index}"]`));
        } else {
          reValid($(`#a_date[data-index="${index}"]`));
        }
        if (time == "") {
          sta = true;
          inValid($(`#a_time[data-index="${index}"]`));
        } else {
          reValid($(`#a_time[data-index="${index}"]`));
        }

        if (pass !== "" && conpass !== "") {
          if (checkChar("pass", pass) == false || pass == "") {
            sta = true;
            inValid($(`#a_pass[data-index="${index}"]`));
          } else {
            reValid($(`#a_pass[data-index="${index}"]`));
          }
          if (checkChar("pass", conpass) == false || conpass == "") {
            sta = true;
            inValid($(`#a_conpass[data-index="${index}"]`));
          } else {
            reValid($(`#a_conpass[data-index="${index}"]`));
          }
          if (pass !== conpass) {
            sta = true;
            inValid($(`#a_pass[data-index="${index}"]`));
          } else {
            reValid($(`#a_pass[data-index="${index}"]`));
          }
        } else if (pass == "" && conpass !== "") {
          sta = true;
          inValid($(`#a_pass[data-index="${index}"]`));
        } else if (pass !== "" && conpass == "") {
          sta = true;
          inValid($(`#a_conpass[data-index="${index}"]`));
        } else {
          sta = true;
          inValid($(`#a_pass[data-index="${index}"]`));
          inValid($(`#a_conpass[data-index="${index}"]`));
        }

        reqArr.push({
          username,
          status,
          email,
          phone,
          date,
          time,
          pass,
          file,
        });
      }
    }
    if (sta == true) {
      ErrorTime(1500, "Data Invalid !!", false);
      return;
    } else {
      insertData(reqArr);
    }
  } else {
    infoTime(1500, "Empty Data ?", false);
    return;
  }
});
$(document).on(`change`, `#a_avatar`, function () {
  var file = this.files[0];
  index = $(this).data("index");
  if (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $(`#Imgpro[data-index="${index}"]`).attr("src", e.target.result);
    };
    reader.readAsDataURL(file);
  }
});
var errArr = [];
function insertData(req) {
  Swal.fire({
    icon: "question",
    title: "<span id='runDot'></span>",
    html: `Upload <span id="Uploadsucc">0</span> From <span id="totalUpload">10</span>`,
    showCancelButton: false,
    showConfirmButton: false,
    allowOutsideClick: false,
    didOpen: () => {
      var dot = " ";
      timerInterval = setInterval(() => {
        if (dot.length == 6) {
          dot = " .";
        } else {
          dot += ".";
        }
        $(`#runDot`).html(`Server running${dot}`);
      }, 200);
    },
  });
  $(`#totalUpload`).html(req.length);
  uploadFilesSequentially(req, 0);
}
function uploadFile(req) {
  var formData = new FormData();
  formData.append("username", req.username);
  formData.append("pass", req.pass);
  formData.append("email", req.email);
  formData.append("phone", req.phone);
  formData.append("date", req.date);
  formData.append("time", req.time);
  formData.append("status", req.status);
  formData.append("file", req.file);
  return $.ajax({
    type: "POST",
    url: "API/add",
    data: formData,
    contentType: false,
    processData: false,
  });
}
function uploadFilesSequentially(req, index) {
  if (index < req.length) {
    uploadFile(req[index])
      .done((res) => {})
      .fail((err) => {})
      .always(function () {
        $(`#Uploadsucc`).html(index);
        uploadFilesSequentially(req, index + 1);
        index++;
      });
  } else {
    successTime(2500, "Add Data success!!", () => {
      inp = 0;
      Addarr = [];
      clearInterval(timerInterval);
      $(`.add-f`).fadeOut(250, () => {
        $(`#form_Add`).html("");
        $(`.table-f`).fadeIn(250);
        serch();
      });
    });
    return;
  }
}

$(document).on(`click`, `#info`, function () {
  var i = $(this).data("id");
  var html = "";
  var date = data[i].Date;
  var time = data[i].Time;
  var timeObject = new Date("2000-01-01 " + time);
  var formattedTime =
    ("0" + timeObject.getHours()).slice(-2) +
    ":" +
    ("0" + timeObject.getMinutes()).slice(-2);
  var dateObject = new Date(date);
  var formattedDate =
    dateObject.getFullYear() +
    "-" +
    ("0" + (dateObject.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + dateObject.getDate()).slice(-2);
  html += `
<div class="form-contain">
<div class="leftf">
<div class="inp-t">
<div>
<i class="fa-regular fa-user"></i>
<input disabled class="disabled form-control" value="${data[i].username}" type="text" placeholder="Username">
</div>
<div>
<i class="fa-solid fa-id-badge"></i>
<select class="form-select disabled" disabled>`;
  switch (data[i].status) {
    case "100":
      html += `<option selected disabled>Admin</option>`;
      break;
    case "200":
      html += `<option selected disabled>Member</option>`;
      break;
    case "300":
      html += `<option selected disabled>Ban</option>`;
      break;
  }
  html += `

</select>
</div>
</div>
<div class="inp-t">
<div>
<i class="fa-regular fa-envelope"></i>
<input disabled class="disabled form-control" type="text" value="${data[i].email}"  placeholder="Email">
</div>
<div>
<i class="fa-solid fa-phone"></i>
<input disabled class="disabled form-control" type="text" value="${data[i].phone}" placeholder="Phone">
</div>
</div>
<div class="inp-t">
<div>
<i class="fa-regular fa-calendar-days"></i>
<input disabled class="disabled form-control" type="date" value="${formattedDate}" placeholder="Date">
</div>
<div>
<i class="fa-regular fa-clock"></i>
<input disabled class="disabled form-control" type="time" value="${formattedTime}" placeholder="Time">
</div>
</div>
<div class="inp-t">
<div>
<i class="fa-regular fa-eye-slash"></i>
<input disabled class="disabled form-control" type="password" value="00000000" placeholder="Password">
</div>
</div>
</div>
<div class="rightf">
<div class="profile">
<div class="bg"></div>
<div class="contain">`;
  if (data[i].avatar == "false") {
    html += `<img id="Imgpro" src="file/userinvalid.png" alt="">`;
  } else {
    html += `<img id="Imgpro" src="file/avatar/${data[i].avatar}" alt="">`;
  }

  html += `
</div>
</div>
</div>
</div>
`;
  $(`#form_Add`).html(html);
  var html = "";
  html += `
  <button type="button" id="Backdata" class="btnAdd"><i class="fa-solid fa-rotate-left"></i> Back</button>
  `;

  $(`.table-f`).fadeOut(250, () => {
    $(`.button-contain`).html(html);
    $(`.textF`).html(`Detail User ${data[i].username}`);
    $(`.add-f`).fadeIn(250);
  });
});
$(document).on(`click`, `#Backdata`, function () {
  $(`.add-f`).fadeOut(250, () => {
    $(`.button-contain`).html("");
    $(`#form_Add`).html("");
    $(`.table-f`).fadeIn(250);
  });
});
$(document).on(`click`, `#delete`, function () {
  if (checked.length > 0) {
    Swal.fire({
      title: `Delete All Selected Data?`,
      text: ` Can't Restore!!`,
      icon: `warning`,
      showCancelButton: true,
      confirmButtonColor: "#04d4a4",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.close();
        infoTime(10000, "Deleting data!!", false);
        $.ajax({
          type: "POST",
          url: "API/delete",
          data: JSON.stringify({ id: checked, type: 200 }),
          contentType: "application/json",
          dataType: "json",
        })
          .done((res) => {
            if (res.status == true) {
              checked = [];
              serch();
              successTime(1500, "Delete Data Success", false);
            } else {
              ErrorTime(1500, "Failed to Delete Data!!", false);
            }
          })
          .err((err) => {
            ErrorTime(1500, "Failed to Delete Data!!", false);
          });
      }
    });
  } else {
    var id = $(this).data("id");
    id = data[id].ID;
    Swal.fire({
      title: `Delete Data?`,
      text: ` Can't Restore!!`,
      icon: `warning`,
      showCancelButton: true,
      confirmButtonColor: "#04d4a4",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.close();
        infoTime(10000, "Deleting data!!", false);
        $.ajax({
          type: "POST",
          url: "API/delete",
          data: JSON.stringify({ id, type: 100 }),
          contentType: "application/json",
          dataType: "json",
        })
          .done((res) => {
            if (res.status == true) {
              serch();
              successTime(1500, "Delete Data Success", false);
            } else {
              ErrorTime(1500, "Failed to Delete Data!!", false);
            }
          })
          .err((err) => {
            ErrorTime(1500, "Failed to Delete Data!!", false);
          });
      }
    });
  }
});

$(document).on(`click`, `#edit`, function () {
  if (checked.length > 1) {
    Editform();
  } else {
    var i = $(this).data("id");
    var html = "";
    var date = data[i].Date;
    var time = data[i].Time;
    var timeObject = new Date("2000-01-01 " + time);
    var formattedTime =
      ("0" + timeObject.getHours()).slice(-2) +
      ":" +
      ("0" + timeObject.getMinutes()).slice(-2);
    var dateObject = new Date(date);
    var formattedDate =
      dateObject.getFullYear() +
      "-" +
      ("0" + (dateObject.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + dateObject.getDate()).slice(-2);
    html += `
  <div class="form-contain" >
  <div class="leftf">
  <div class="inp-t">
  <div>
  <i class="fa-regular fa-user"></i>
  <input class="form-control" id="e_username" value="${data[i].username}" type="text" placeholder="Username">
  </div>
  <div>
  <i class="fa-solid fa-id-badge"></i>
  <select class="form-select" id="e_status">
  <option value="500" disabled>Status</option>
  <option value="100">Admin</option>
  <option value="200">Member</option>
  <option value="300">Ban</option>
  </select>
  </div>
  </div>
  <div class="inp-t">
  <div>
  <i class="fa-regular fa-envelope"></i>
  <input class="form-control" type="text" value="${data[i].email}" id="e_email" placeholder="Email">
  </div>
  <div>
  <i class="fa-solid fa-phone"></i>
  <input class="form-control" type="text" value="${data[i].phone}" id="e_phone" placeholder="Phone">
  </div>
  </div>
  <div class="inp-t">
  <div>
  <i class="fa-regular fa-calendar-days"></i>
  <input class="form-control" type="date" value="${formattedDate}" id="e_date" placeholder="Date">
  </div>
  <div>
  <i class="fa-regular fa-clock"></i>
  <input class="form-control" type="time" value="${formattedTime}" id="e_time" placeholder="Time">
  </div>
  </div>
  <div class="inp-t">
  <div>
  <i class="fa-regular fa-eye-slash"></i>
  <input class="form-control" type="password" id="e_pass" placeholder="Password">
  </div>
  <div>
  <i class="fa-regular fa-eye-slash"></i>
  <input class="form-control" type="password" id="e_conpass" placeholder="Confirm Password">
  </div>
  </div>
  </div>
  <div class="rightf">
  <div class="profile">
  <div class="bg"></div>
  <div class="contain">`;
    if (data[i].avatar == "false") {
      html += `<img id="Imgpro" src="file/userinvalid.png" alt="">`;
    } else {
      html += `<img id="Imgpro" src="file/avatar/${data[i].avatar}" alt="">`;
    }
    html += `
  </div>
  <div class="input-con">
  <button class="open-file">
  <span class="file-wrapper">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 71 67">
  <path stroke-width="5" stroke="black"
  d="M41.7322 11.7678L42.4645 12.5H43.5H68.5V64.5H2.5V2.5H32.4645L41.7322 11.7678Z">
  </path>
  </svg>
  <span class="file-front"></span>
  </span>
  Upload Profile
  <input id="e_avatar" class="inpBtn form-control" type="file" accept=".png,.jpeg,.webp,.jpg">
  </button>
  </div>
  </div>
  </div>
  </div>
  `;
    $(`#form_Add`).html(html);
    $(`#e_status option[value="${data[i].status}"]`).prop("selected", true);
    var html = "";
    html += `
    <button type="button" id="SaveEdit" data-id="${data[i].ID}" class="btnAdd"><i class="fa-solid fa-floppy-disk"></i> Save</button>
    <button type="button" id="Backdata" class="btncanCel"><i class="fa-solid fa-rotate-left"></i> Back</button>
    `;
    $(`.table-f`).fadeOut(250, () => {
      $(`.button-contain`).html(html);
      $(`.textF`).html(`Edit Data User ${data[i].username}`);
      $(`.add-f`).fadeIn(250);
    });
  }
});

$(document).on(`click`, `#SaveEdit`, function () {
  var ID = $(this).data("id");
  sta = false;
  var username = $(`#e_username`).val();
  var email = $(`#e_email`).val();
  var phone = $(`#e_phone`).val();
  var status = $(`#e_status`).val();
  var time = $(`#e_time`).val();
  var date = $(`#e_date`).val();
  var pass = $(`#e_pass`).val();
  var conpass = $(`#e_conpass`).val();
  var allow = [100, 200, 300];
  var file = $(`#e_avatar`);
  file = file[0].files;
  if (file.length == 0) {
    file = false;
  } else {
    file = file[0];
  }
  if (checkChar("All", username) == false || username == "") {
    sta = true;
    inValid($(`#e_username`));
  } else {
    reValid($(`#e_username`));
  }
  if (!allow.includes(parseInt(status))) {
    sta = true;
    inValid($(`#e_status`));
  } else {
    reValid($(`#e_status`));
  }
  if (checkEmail(email) == false || email == "") {
    sta = true;
    inValid($(`#e_email`));
  } else {
    reValid($(`#e_email`));
  }
  if (checkChar("num", phone) == false || phone == "" || phone.length !== 10) {
    sta = true;
    inValid($(`#e_phone`));
  } else {
    reValid($(`#e_phone`));
  }
  if (date == "") {
    sta = true;
    inValid($(`#e_date`));
  } else {
    reValid($(`#e_date`));
  }
  if (time == "") {
    sta = true;
    inValid($(`#e_time`));
  } else {
    reValid($(`#e_time`));
  }

  if (pass !== "" && conpass !== "") {
    if (checkChar("pass", pass) == false || pass == "") {
      sta = true;
      inValid($(`#e_pass`));
    } else {
      reValid($(`#e_pass`));
    }
    if (checkChar("pass", conpass) == false || conpass == "") {
      sta = true;
      inValid($(`#e_conpass`));
    } else {
      reValid($(`#e_conpass`));
    }
    if (pass !== conpass) {
      sta = true;
      inValid($(`#e_conpass`));
    } else {
      reValid($(`#e_conpass`));
    }
  } else if (pass == "" && conpass !== "") {
    sta = true;
    inValid($(`#e_pass`));
  } else if (pass !== "" && conpass == "") {
    sta = true;
    inValid($(`#e_conpass`));
  } else {
    reValid($(`#e_conpass`));
    reValid($(`#e_pass`));
    pass = "true";
  }

  if (sta == true) {
    ErrorTime(1500, "Data Invalid !!", false);
    return;
  } else {
    infoTime(10000, "Editing Data ...", false);
    var formData = new FormData();
    formData.append("ID", ID);
    formData.append("username", username);
    formData.append("pass", pass);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("status", status);
    formData.append("file", file);
    $.ajax({
      type: "POST",
      url: "API/edit",
      data: formData,
      contentType: false,
      processData: false,
    })
      .done((res) => {
        successTime(1500, "Editing Success !!", false);
        $(`.add-f`).fadeOut(250, () => {
          $(`.button-contain`).html("");
          $(`#form_Add`).html("");
          $(`.table-f`).fadeIn(250);
          serch();
        });
      })
      .fail((err) => {
        ErrorTime(1500, "Server Error!!", false);
      });
  }
});

$(document).on(`change`, `#e_avatar`, function () {
  var file = this.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $(`#Imgpro`).attr("src", e.target.result);
    };
    reader.readAsDataURL(file);
  }
});

var Editarr = [];
function Editform() {
  for (var i = 0; i < checked.length; i++) {
    createform(i, checked[i].data);
    Editarr.push(i);
  }
  var html = "";
  html += `
    <button type="button" id="SaveMulEdit" class="btnAdd"><i class="fa-solid fa-floppy-disk"></i> Save</button>
    <button type="button" id="canCelEdit" class="btncanCel"><i class="fa-solid fa-rotate-left"></i> Back</button>
    `;
  $(`.table-f`).fadeOut(250, () => {
    $(`.button-contain`).html(html);
    $(`.textF`).html(`Edit Data`);
    $(`.add-f`).fadeIn(250);
  });
}
$(document).on(`click`, `#canCelEdit`, function () {
  $(`.add-f`).fadeOut(250, () => {
    $(`.button-contain`).html("");
    $(`#form_Add`).html("");
    $(`.table-f`).fadeIn(250);
  });
  Editarr = [];
});
function createform(index, req) {
  var date = req.Date;
  var time = req.Time;
  var timeObject = new Date("2000-01-01 " + time);
  var formattedTime =
    ("0" + timeObject.getHours()).slice(-2) +
    ":" +
    ("0" + timeObject.getMinutes()).slice(-2);
  var dateObject = new Date(date);
  var formattedDate =
    dateObject.getFullYear() +
    "-" +
    ("0" + (dateObject.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + dateObject.getDate()).slice(-2);
  var html = "";
  html += `
<div class="form-contain">
<input id="E_ID" data-id="${req.ID}"  data-index="${index}" type="hidden" disabled>
<div class="leftf">
  <div class="inp-t">
  <div>
  <i class="fa-regular fa-user"></i>
  <input class="form-control" id="E_username" data-index="${index}" value="${req.username}" type="text" placeholder="Username">
  </div>
  <div>
  <i class="fa-solid fa-id-badge"></i>
  <select class="form-select" id="E_status" data-index="${index}">
  <option value="500" disabled>Status</option>
  <option value="100">Admin</option>
  <option value="200">Member</option>
  <option value="300">Ban</option>
  </select>
  </div>
  </div>
  <div class="inp-t">
  <div>
  <i class="fa-regular fa-envelope"></i>
  <input class="form-control" type="text" data-index="${index}" value="${req.email}" id="E_email" placeholder="Email">
  </div>
  <div>
  <i class="fa-solid fa-phone"></i>
  <input class="form-control" type="text" data-index="${index}" value="${req.phone}" id="E_phone" placeholder="Phone">
  </div>
  </div>
  <div class="inp-t">
  <div>
  <i class="fa-regular fa-calendar-days"></i>
  <input class="form-control" type="date" data-index="${index}" value="${formattedDate}" id="E_date" placeholder="Date">
  </div>
  <div>
  <i class="fa-regular fa-clock"></i>
  <input class="form-control" type="time" data-index="${index}" value="${formattedTime}" id="E_time" placeholder="Time">
  </div>
  </div>
  <div class="inp-t">
  <div>
  <i class="fa-regular fa-eye-slash"></i>
  <input class="form-control" type="password" data-index="${index}" id="E_pass" placeholder="Password">
  </div>
  <div>
  <i class="fa-regular fa-eye-slash"></i>
  <input class="form-control" type="password" data-index="${index}" id="E_conpass" placeholder="Confirm Password">
  </div>
  </div>
  </div>
  <div class="rightf">
  <div class="profile">
  <div class="bg"></div>
  <div class="contain">`;
  if (req.avatar == "false") {
    html += `<img id="E_Imgpro" data-index="${index}" src="file/userinvalid.png" alt="">`;
  } else {
    html += `<img id="E_Imgpro" data-index="${index}" src="file/avatar/${req.avatar}" alt="">`;
  }
  html += `
  </div>
  <div class="input-con">
  <button class="open-file">
  <span class="file-wrapper">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 71 67">
  <path stroke-width="5" stroke="black"
  d="M41.7322 11.7678L42.4645 12.5H43.5H68.5V64.5H2.5V2.5H32.4645L41.7322 11.7678Z">
  </path>
  </svg>
  <span class="file-front"></span>
  </span>
  Upload Profile
  <input id="E_avatar" data-index="${index}" class="inpBtn form-control" type="file" accept=".png,.jpeg,.webp,.jpg">
  </button>
  </div>
  </div>
  </div>
  </div>
  `;
  $(`#form_Add`).append(html);
  $(`#E_status[data-index="${index}"] option[value="${req.status}"]`).prop(
    "selected",
    true
  );
}

$(document).on(`change`, `#E_avatar`, function () {
  var file = this.files[0];
  index = $(this).data("index");
  if (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $(`#E_Imgpro[data-index="${index}"]`).attr("src", e.target.result);
    };
    reader.readAsDataURL(file);
  }
});
$(document).on(`click`, `#SaveMulEdit`, () => {
  var reqArr = [];
  if (Editarr.length !== 0) {
    var sta = false;
    for (var i = 0; i < Editarr.length; i++) {
      var index = Editarr[i];
      sta = false;
      var ID = $(`#E_ID[data-index="${index}"]`).data("id");
      var username = $(`#E_username[data-index="${index}"]`).val();
      var email = $(`#E_email[data-index="${index}"]`).val();
      var phone = $(`#E_phone[data-index="${index}"]`).val();
      var status = $(`#E_status[data-index="${index}"]`).val();
      var time = $(`#E_time[data-index="${index}"]`).val();
      var date = $(`#E_date[data-index="${index}"]`).val();
      var pass = $(`#E_pass[data-index="${index}"]`).val();
      var conpass = $(`#E_conpass[data-index="${index}"]`).val();
      var allow = [100, 200, 300];
      var file = $(`#E_avatar[data-index="${index}"]`);
      file = file[0].files;
      if (file.length == 0) {
        file = false;
      } else {
        file = file[0];
      }
      if (checkChar("num", ID) == false) {
        sta = true;
      }
      if (checkChar("All", username) == false || username == "") {
        sta = true;
        inValid($(`#E_username[data-index="${index}"]`));
      } else {
        reValid($(`#E_username[data-index="${index}"]`));
      }
      if (!allow.includes(parseInt(status))) {
        sta = true;
        inValid($(`#E_status[data-index="${index}"]`));
      } else {
        reValid($(`#E_status[data-index="${index}"]`));
      }
      if (checkEmail(email) == false || email == "") {
        sta = true;
        inValid($(`#E_email[data-index="${index}"]`));
      } else {
        reValid($(`#E_email[data-index="${index}"]`));
      }
      if (
        checkChar("num", phone) == false ||
        phone == "" ||
        phone.length !== 10
      ) {
        sta = true;
        inValid($(`#E_phone[data-index="${index}"]`));
      } else {
        reValid($(`#E_phone[data-index="${index}"]`));
      }
      if (date == "") {
        sta = true;
        inValid($(`#E_date[data-index="${index}"]`));
      } else {
        reValid($(`#E_date[data-index="${index}"]`));
      }
      if (time == "") {
        sta = true;
        inValid($(`#E_time[data-index="${index}"]`));
      } else {
        reValid($(`#E_time[data-index="${index}"]`));
      }

      if (pass !== "" && conpass !== "") {
        if (checkChar("pass", pass) == false || pass == "") {
          sta = true;
          inValid($(`#E_pass[data-index="${index}"]`));
        } else {
          reValid($(`#E_pass[data-index="${index}"]`));
        }
        if (checkChar("pass", conpass) == false || conpass == "") {
          sta = true;
          inValid($(`#E_conpass[data-index="${index}"]`));
        } else {
          reValid($(`#E_conpass[data-index="${index}"]`));
        }
        if (pass !== conpass) {
          sta = true;
          inValid($(`#E_conpass[data-index="${index}"]`));
        } else {
          reValid($(`#E_conpass[data-index="${index}"]`));
        }
      } else if (pass == "" && conpass !== "") {
        sta = true;
        inValid($(`#E_pass[data-index="${index}"]`));
      } else if (pass !== "" && conpass == "") {
        sta = true;
        inValid($(`#E_conpass[data-index="${index}"]`));
      } else {
        reValid($(`#E_conpass[data-index="${index}"]`));
        reValid($(`#E_pass[data-index="${index}"]`));
        pass = "true";
      }
      reqArr.push({
        username,
        status,
        email,
        phone,
        date,
        time,
        pass,
        file,
        ID,
      });
    }
    if (sta == true) {
      ErrorTime(1500, "Data Invalid !!", false);
      return;
    } else {
      EditStart(reqArr);
    }
  } else {
    $(`.add-f`).fadeOut(250, () => {
      $(`.button-contain`).html("");
      $(`#form_Add`).html("");
      $(`.table-f`).fadeIn(250);
    });
    Editarr = [];
  }
});
function EditStart(req) {
  Swal.fire({
    icon: "question",
    title: "<span id='runDot'></span>",
    html: `Upload <span id="Uploadsucc">0</span> From <span id="totalUpload">10</span>`,
    showCancelButton: false,
    showConfirmButton: false,
    allowOutsideClick: false,
    didOpen: () => {
      var dot = " ";
      timerInterval = setInterval(() => {
        if (dot.length == 6) {
          dot = " .";
        } else {
          dot += ".";
        }
        $(`#runDot`).html(`Server running${dot}`);
      }, 200);
    },
  });
  $(`#totalUpload`).html(req.length);
  uploadFilesEdit(req, 0);
}
function EdituploadFile(req) {
  var formData = new FormData();
  formData.append("ID", req.ID);
  formData.append("username", req.username);
  formData.append("pass", req.pass);
  formData.append("email", req.email);
  formData.append("phone", req.phone);
  formData.append("date", req.date);
  formData.append("time", req.time);
  formData.append("status", req.status);
  formData.append("file", req.file);
  return $.ajax({
    type: "POST",
    url: "API/edit",
    data: formData,
    contentType: false,
    processData: false,
  });
}
function uploadFilesEdit(req, index) {
  if (index < req.length) {
    EdituploadFile(req[index])
      .done((res) => {})
      .fail((err) => {})
      .always(function () {
        $(`#Uploadsucc`).html(index + 1);
        uploadFilesEdit(req, index + 1);
        index++;
      });
  } else {
    successTime(2500, "Edit Data success!!", () => {
      Editarr = [];
      clearInterval(timerInterval);
      $(`.add-f`).fadeOut(250, () => {
        $(`#form_Add`).html("");
        $(`.table-f`).fadeIn(250);
        serch();
      });
    });
    return;
  }
}
