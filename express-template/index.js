const express = require("express")
const axios = require("axios")

const app = new express()
app.use(express.json())

app.get("/api/supervisors", async (req, res) => {
  axios
    .get("https://o3m5qixdng.execute-api.us-east-1.amazonaws.com/api/managers")
    .then(response => {
      var temp = []
      var data = response.data

      //To make new object that has only three keys "jurisdiction, lastName, firstName" excluding numeric jurisdiction
      data.map((item, index) => {
        var obj = {}
        if (!parseInt(item.jurisdiction) && parseInt(item.jurisdiction) != 0) {
          obj.jurisdiction = item.jurisdiction
          obj.lastName = item.lastName
          obj.firstName = item.firstName
          temp.push(obj)
        }
      })

      //sorting method by jurisdiction, lastName, firstName
      temp.sort(
        (a, b) =>
          a.jurisdiction.toString().localeCompare(b.jurisdiction) ||
          a.lastName.toString().localeCompare(b.lastName) ||
          b.firstName.toString().localeCompare(a.firstName)
      )

      res.json(temp)
    })
    .catch(error => {
      console.error(error)
    })
})

app.post("/api/submit", async (req, res) => {
  try {
    if (
      typeof req.query.lastName == "undefined" ||
      typeof req.query.firstName == "undefined" ||
      typeof req.query.supervisor == "undefined"
    ) {
      res.json({
        result: "firstName, lastName, supervisor have to be filled ",
      })
    } else {
      res.json({
        result: req.query,
      })
    }
  } catch (e) {
    res.json({
      error: e.message,
    })
  }
})

app.listen(8080, () => {
  console.log("Listening on 8080. Ctrl+c to stop this server.")
})
