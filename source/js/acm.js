var __author__ = "Guangyaochenyu";
var __version__ = "2.0";
var __database__ = "HRBUACM";
var __status__ = false;
var __alphabet__ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var obj = {};
var ajax = (url) => {
  var a = new XMLHttpRequest();
  a.open("get", url, false);
  a.send();
  return a.responseText;
};
var cors = (url) => {
  var a = new XMLHttpRequest();
  a.open("get", "./cors.php?url=" + url, false);
  a.send();
  return a.responseText;
};
var note = (url, text) => {
  var a = new XMLHttpRequest();
  a.open("POST", "./post.php", false);
  a.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  a.send("url=" + url + "&text=" + text);
};
var data = (json) => {
  var a = new XMLHttpRequest();
  a.open("post", "./mysql.php?timestamp=" + new Date().getTime(), false);
  a.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  a.send("json=" + json);
  return a.responseText;
};
var escape2Html = (str) =>
  str.replace(
    /&(lt|gt|nbsp|amp|quot);/gi,
    (all, t) => ({ lt: "<", gt: ">", nbsp: " ", amp: "&", quot: '"' }[t])
  );
var deal = (url) => cors(url).match(/\{.*\}/)[0];
var nurl = (str) => "https://notes.orga.cat/" + str;
var resp = (str) => JSON.parse(escape2Html(str));
var download = () => resp(deal(nurl(__database__)));
var update = (obj) => {
  note(nurl(__database__), JSON.stringify(obj));
};
var pageChange = (page) => {
  for (var i = 1; i <= 5; i++)
    document.getElementById("page" + i).classList.add("hidden");
  for (var i = 1; i <= 5; i++)
    document
      .getElementById("pageList")
      .children[i].classList.remove("text-danger");
  for (var i = 1; i <= 5; i++)
    document.getElementById("pageList").children[i].classList.add("text-info");
  document.getElementById("page" + page).classList.remove("hidden");
  document
    .getElementById("pageList")
    .children[page].classList.remove("text-info");
  document
    .getElementById("pageList")
    .children[page].classList.add("text-danger");
};
var newLine = (num) => {
  var ret = "<tr>";
  for (var i = 0; i < num; i++) ret += "<td><input type='text' value=''></td>";
  return ret + "</tr>";
};
var UserList = () => {
  var ret = "";
  for (var i in obj.UserList) {
    ret += "<tr><td><input type='text' value='" + i + "'></td>";
    for (var j = 0; j < 4; j++)
      ret += "<td><input type='text' value='" + obj.UserList[i][j] + "'></td>";
    ret += "</tr>";
  }
  return ret;
};
var getUser = () => {
  var tbody = document.getElementById("tbody4");
  var ret = "";
  for (var i = 0; i < tbody.children.length; i++)
    if (tbody.children[i].children[0].children[0].value != "") {
      ret += "<tr>";
      for (var j = 0; j < 5; j++)
        ret +=
          "<td><input type='text' value='" +
          tbody.children[i].children[j].children[0].value +
          "'></td>";
      ret += "</tr>";
    }
  return ret;
};
var objUser = () => {
  var tbody = document.getElementById("tbody4");
  var ret = {};
  for (var i = 0; i < tbody.children.length; i++)
    if (tbody.children[i].children[0].children[0].value != "") {
      var tmp = [];
      for (var j = 1; j < 5; j++)
        tmp.push(tbody.children[i].children[j].children[0].value);
      ret[tbody.children[i].children[0].children[0].value] = tmp;
    }
  return ret;
};
var ContestList = () => {
  var ret = "";
  for (var i in obj.ContestList) {
    ret +=
      "<tr><td><input type='text' value='" +
      i +
      "'></td><td><input type='text' value='" +
      obj.ContestList[i]["pf"] +
      "'></td><td><input class='name' type='text' value='" +
      obj.ContestList[i]["name"] +
      "'></td>";
    ret +=
      "<td onclick='updateContest(\"" +
      i +
      "\")'>" +
      dayjs(obj.ContestList[i]["ts"]).format("YYYY/MM/DD HH:mm:ss") +
      "</td></tr>";
  }
  return ret;
};
var getContest = () => {
  var tbody = document.getElementById("tbody3");
  var ret = "";
  for (var i = 0; i < tbody.children.length; i++)
    if (tbody.children[i].children[0].children[0].value != "") {
      ret +=
        "<tr><td><input type='text' value='" +
        tbody.children[i].children[0].children[0].value +
        "'></td><td><input type='text' value='" +
        tbody.children[i].children[1].children[0].value +
        "'></td><td><input class='name' type='text' value='" +
        tbody.children[i].children[2].children[0].value +
        "'></td><td onclick='updateContest(\"" +
        tbody.children[i].children[0].children[0].value +
        "\")'>";
      if (
        obj.ContestList[tbody.children[i].children[0].children[0].value] ==
        undefined
      ) {
        ret += dayjs().format("YYYY/MM/DD HH:mm:ss");
      } else {
        if (
          obj.ContestList[tbody.children[i].children[0].children[0].value].pf ==
            tbody.children[i].children[1].children[0].value &&
          obj.ContestList[tbody.children[i].children[0].children[0].value]
            .name == tbody.children[i].children[2].children[0].value
        ) {
          ret += tbody.children[i].children[3].innerHTML;
        } else {
          ret += dayjs().format("YYYY/MM/DD HH:mm:ss");
        }
      }
      ret += "</td></tr>";
    }
  return (tbody.innerHTML = ret);
};
var objContest = () => {
  var tbody = document.getElementById("tbody3");
  var ret = {};
  for (var i = 0; i < tbody.children.length; i++)
    if (tbody.children[i].children[0].children[0].value != "") {
      var tmp = {};
      tmp.pf = tbody.children[i].children[1].children[0].value;
      tmp.name = tbody.children[i].children[2].children[0].value;
      tmp.ts = dayjs(tbody.children[i].children[3].innerHTML).valueOf();
      ret[tbody.children[i].children[0].children[0].value] = tmp;
    }
  return ret;
};
var shortNameVjudge = (name) => {
  var a = obj.ContestList[name].name;
  return (
    a.substring(a.indexOf("m") + 1, a.indexOf("寒")) +
    " (" +
    a.substring(a.indexOf("午") - 1, a.indexOf("午") + 1) +
    ")"
  );
};
var shortNameCodeForces = (name) => {
  return obj.ContestList[name].name
    .replace("Rated for ", "")
    .replace("Educational Codeforces Round ", "EDU#")
    .replace("Codeforces Round ", "CF");
};
var shortNameAtcoder = (name) => name.toUpperCase();
var shortNameAcWing = (name) => {
  var a = obj.ContestList[name].name;
  return (
    "AcWing" +
    a.substring(a.length - 2, a.length) +
    a.substring(a.indexOf("第") + 2, a.indexOf(" 场"))
  );
};
var shortName = (name) => {
  if (obj.ContestList[name].pf == "Vjudge") return shortNameVjudge(name);
  if (obj.ContestList[name].pf == "CodeForces")
    return shortNameCodeForces(name);
  if (obj.ContestList[name].pf == "Atcoder") return shortNameAtcoder(name);
  if (obj.ContestList[name].pf == "AcWing") return shortNameAcWing(name);
  return obj.ContestList[name].name;
};
var getVjudge = (Contest) => {
  var dict = {};
  var ret = {};
  for (var i in obj.UserList) {
    dict[obj.UserList[i][0]] = i;
    ret[i] = {};
  }
  var RoughData = JSON.parse(
    ajax("https://vjudge.csgrandeur.cn/contest/rank/single/" + Contest)
  );
  obj.ContestList[Contest].name = RoughData.title;
  obj.ContestDetail[Contest] = {};
  var Contest_Morning = new Date(RoughData.begin).getHours() == 8;
  var b = new Date(RoughData.begin);
  var e = new Date(
    b.getFullYear(),
    b.getMonth(),
    b.getDate(),
    b.getHours() == 13 ? 17 : 12,
    0,
    0,
    0
  );
  var length = (e - b) / 1000;
  for (var i = 0; i < RoughData.submissions.length; i++) {
    if (RoughData.submissions[i][3] > length) break;
    if (
      RoughData.submissions[i][2] == 1 &&
      dict[RoughData.participants[RoughData.submissions[i][0]][0]] != undefined
    )
      ret[dict[RoughData.participants[RoughData.submissions[i][0]][0]]][
        __alphabet__[RoughData.submissions[i][1]]
      ] = 1;
  }
  for (var i in ret) {
    var tmp = "";
    for (var j = 0; j < __alphabet__.length; j++)
      if (ret[i][__alphabet__[j]] == 1) tmp += __alphabet__[j];
    ret[i] = tmp;
  }
  return ret;
};
var getCodeForces = (Contest) => {
  var dict = {};
  var ret = {};
  for (var i in obj.UserList) {
    dict[obj.UserList[i][1]] = i;
    ret[i] = {};
  }
  var RoughData = JSON.parse(
    ajax(
      "https://codeforces.com/api/contest.standings?contestId=" +
        Contest +
        "&showUnofficial=false"
    )
  );
  if (RoughData.status == "OK") {
    obj.ContestList[Contest].name = RoughData.result.contest.name;
    obj.ContestDetail[Contest] = {};
    for (var i = 0; i < RoughData.result.rows.length; i++)
      if (dict[RoughData.result.rows[i].party.members[0].handle] != undefined)
        for (var j = 0; j < RoughData.result.problems.length; j++)
          ret[dict[RoughData.result.rows[i].party.members[0].handle]][j] =
            RoughData.result.rows[i].problemResults[j].points;
    for (var i in ret)
      if (ret[i][0] == undefined)
        for (var j = 0; j < RoughData.result.problems.length; j++)
          ret[i][j] = 0;
    for (var i in ret) {
      var tmp = "";
      for (var j = 0; j < RoughData.result.problems.length; j++)
        if (ret[i][j] != 0) tmp += RoughData.result.problems[j].index;
      ret[i] = tmp;
    }
  }
  return ret;
};
var getAtcoder = (Contest) => {
  var dict = {};
  var ret = {};
  for (var i in obj.UserList) {
    dict[obj.UserList[i][2]] = i;
    ret[i] = "";
  }
  var tmp;
  var originData = cors(
    "https://atcoder.jp/contests/" + Contest + "/submissions"
  );
  tmp = originData.indexOf("-");
  obj.ContestList[Contest].name = originData.substring(
    tmp + 2,
    originData.indexOf("</title>")
  );
  var getAtcoder2 = (html) => {
    var ret = {};
    var index = html.indexOf("<tbody>");
    while (true) {
      index = html.indexOf("<tr>", index);
      if (index == -1) break;
      index++;
      var sub = html.substring(index, html.indexOf("</tr>", index));
      if (sub.indexOf("AC") != -1)
        ret[
          __alphabet__.indexOf(
            sub
              .substring(
                sub.indexOf("_", sub.indexOf("tasks")) + 1,
                sub.indexOf('"', sub.indexOf("tasks"))
              )
              .toUpperCase()
          )
        ] = 1;
    }
    return ret;
  };
  for (var i in dict) {
    var RoughData = cors(
      "https://atcoder.jp/contests/" + Contest + "/submissions?f.User=" + i
    );
    tmp = RoughData.lastIndexOf("page=");
    var pageLen = parseInt(
      RoughData.substring(
        RoughData.indexOf(">", tmp) + 1,
        RoughData.indexOf("<", tmp)
      )
    );
    if (pageLen != NaN) {
      for (var page = 1; page <= pageLen; page++) {
        url =
          "https://atcoder.jp/contests/" +
          Contest +
          "/submissions?f.User=" +
          i +
          "&page=" +
          page;
        tmp = getAtcoder2(cors(url));
        for (var j in tmp) ret[dict[i]][j] = 1;
      }
    }
  }
  for (var i in ret) {
    tmp = "";
    for (var j = 0; j < __alphabet__.length; j++)
      if (ret[i][j] == 1) tmp += __alphabet__[j];
    ret[i] = tmp;
  }
  return ret;
};
var getAcWing = (Contest) => {
  var dict = {};
  var ret = {};
  for (var i in obj.UserList) {
    dict[obj.UserList[i][3]] = i;
    ret[i] = "";
  }
  var tmp;
  var originData = cors(
    "https://www.acwing.com/activity/content/competition/rank/" +
      Contest +
      "/1/"
  );
  tmp = originData.indexOf("description");
  obj.ContestList[Contest].name = originData.substring(
    originData.indexOf('="', tmp) + 2,
    originData.indexOf("。", tmp)
  );
  var getAcWing2 = (html) => {
    var ret = {};
    var index = html.indexOf("<tbody");
    while (true) {
      index = html.indexOf("<tr", index);
      if (index == -1) break;
      index++;
      var name = html
        .substring(
          html.indexOf("&nbsp;", index) + 6,
          html.indexOf("</a>", index)
        )
        .replace(/(^\s*)|(\s*$)/g, "");
      for (var i = 0; i < 4; i++) {
        index = html.indexOf("<td", index) + 1;
      }
      tmp = "";
      for (var i = 0; i < 3; i++) {
        index = html.indexOf("<td", index) + 1;
        if (
          html.substring(index, html.indexOf("</td", index)).indexOf("span") !=
          -1
        )
          tmp += __alphabet__[i];
      }
      ret[name] = tmp;
    }
    return ret;
  };
  tmp =
    originData.lastIndexOf(
      '<a href="/activity/content/competition/rank/' + Contest + "/"
    ) + ('<a href="/activity/content/competition/rank/' + Contest + "/").length;
  var pageLen = originData.substring(tmp, originData.indexOf("/", tmp));
  for (var i = 1; i <= pageLen; i++) {
    tmp = getAcWing2(
      cors(
        "https://www.acwing.com/activity/content/competition/rank/" +
          Contest +
          "/" +
          i +
          "/"
      )
    );
    for (j in tmp) if (dict[j] != undefined) ret[dict[j]] = tmp[j];
  }
  for (var i in ret) if (ret[i] == {}) ret[i] = "";
  return ret;
};
var DailyTrain = () => {
  var thead = document.getElementById("thead1");
  var temp = "<tr><td></td>";
  for (var i in obj.UserList) {
    temp += "<td>" + i + "</td>";
  }
  temp += "</tr>";
  thead.innerHTML = temp;
  temp = "";
  for (var i in obj.ContestDetail) {
    if (obj.ContestList[i].pf == "Vjudge") {
      temp += "<tr><td>" + shortName(i) + "</td>";
      for (var j in obj.UserList) {
        temp += "<td>" + obj.ContestDetail[i][j] + "</td>";
      }
      temp += "</tr>";
    }
  }
  return temp;
};
var DailyContest = () => {
  var thead = document.getElementById("thead2");
  var temp = "<tr><td></td>";
  for (var i in obj.UserList) {
    temp += "<td>" + i + "</td>";
  }
  temp += "</tr>";
  thead.innerHTML = temp;
  temp = "";
  for (var i in obj.ContestDetail) {
    if (obj.ContestList[i].pf != "Vjudge") {
      temp += "<tr><td>" + shortName(i) + "</td>";
      for (var j in obj.UserList) {
        temp += "<td>" + obj.ContestDetail[i][j] + "</td>";
      }
      temp += "</tr>";
    }
  }
  return temp;
  return temp;
};
var updateContest = (Contest) => {
  switch (obj.ContestList[Contest].pf) {
    case "Vjudge":
      obj.ContestDetail[Contest] = getVjudge(Contest);
      break;
    case "CodeForces":
      obj.ContestDetail[Contest] = getCodeForces(Contest);
      break;
    case "Atcoder":
      obj.ContestDetail[Contest] = getAtcoder(Contest);
      break;
    case "AcWing":
      obj.ContestDetail[Contest] = getAcWing(Contest);
      break;
    default:
      return false;
  }
  obj.TimeStamp.ContestList = Math.round(new Date());
  obj.ContestList[Contest].ts = Math.round(new Date());
  document.getElementById("tbody3").innerHTML = ContestList();
  fresh();
  return (__status__ = true);
};
var submit = () => {
  console.log("submit");
  if (UserList() != getUser()) {
    __status__ = true;
    obj.UserList = objUser();
    obj.TimeStamp.UserList = Math.round(new Date());
  }
  if (ContestList() != getContest()) {
    __status__ = true;
    obj.ContestList = objContest();
    obj.TimeStamp.ContestList = Math.round(new Date());
  }
  var tbody = document.getElementById("tbody3");
  for (var i = 0; i < tbody.children.length; i++) {
    if (
      obj.ContestDetail[tbody.children[i].children[0].children[0].value] ==
      undefined
    ) {
      updateContest(tbody.children[i].children[0].children[0].value);
      __status__ = true;
    }
  }
  for (var i in obj.ContestList)
    if (obj.ContestList[i].ts < obj.TimeStamp.UserList) updateContest(i);
  if (__status__) {
    console.log("update(obj);");
    update(obj);
    __status__ = false;
  }
  fresh();
};
