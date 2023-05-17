const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const db = require("./connection");
// const exp = require("constants");
const multer = require("multer");
// const { application } = require("express");
// const bodyParser = require("body-parser");
const app = express();
const spawn = require("child_process").spawn;
const fs = require("fs");

db.connect((error) => {
  if (error) throw error;
  console.log("CONNECTED SUCCESSFULLY TO DATABASE");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, `./assets/uploads/${req.body.folder}`);
  },
  filename: function (req, file, cb) {
    return cb(null, `${req.body.id}${Date.now()}.pdf`);
  },
});

const upload = multer({ storage });

app.use(express.static(path.join(__dirname, "assets")));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
// app.use(express.bodyParser());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact-us", (req, res) => {
  res.render("contact");
});

app.get("/stu/login", (req, res) => {
  res.render("stu/login");
});

app.get("/stu/register", (req, res) => {
  res.render("stu/reg");
});

app.get("/rec/login", (req, res) => {
  res.render("rec/login");
});

app.get("/rec/register", (req, res) => {
  res.render("rec/reg");
});

app.get("/admin/login", (req, res) => {
  res.render("admin/login");
});

app.post("/stu/register", (req, res) => {
  const data = req.body;
  if (data.Contact === "") {
    data.Contact = "NULL";
    console.log(data.Contact);
  }
  if (data.PersonalEmail === "") {
    data.PersonalEmail = null;
    console.log(data.PersonalEmail);
    const q = `INSERT INTO Student VALUES(${data.RollNo},'${data.Email}','${data.FirstName}','${data.LastName}','${data.Course}','${data.Department}',${data.YearofPassing},${data.PersonalEmail},${data.Contact},NULL,CURDATE(),'${data.Password}',CURDATE())`;
    db.query(q, (error, result) => {
      if (error) res.send(error);
      else {
        console.log(result);
        res.send("Student Registration Succesful" + result.insertId);
      }
    });
  } else {
    const q = `INSERT INTO Student VALUES(${data.RollNo},'${data.Email}','${data.FirstName}','${data.LastName}','${data.Course}','${data.Department}',${data.YearofPassing},'${data.PersonalEmail}',${data.Contact},NULL,CURDATE(),'${data.Password}',CURDATE())`;
    db.query(q, (error, result) => {
      if (error) res.send(error);
      else {
        console.log(result);
        res.send("Student Registration Succesful" + result.insertId);
      }
    });
  }
});

app.post("/stu", (req, res) => {
  console.log(req.body);
  const data = req.body;
  const q = `SELECT RollNo,Password from Student where Email='${data.Email}'`;
  db.query(q, (error, result) => {
    const r = result;
    if (r.length <= 0) {
      res.send("Invalid Email");
      console.log("Invalid Email");
    } else {
      console.log(r);
      if (data.Password === r[0].Password) {
        res.redirect(`/stu/${r[0].RollNo}`);
      } else {
        res.send("Incorrect Password");
      }
    }
  });
});

app.get("/stu/:id", (req, res) => {
  const roll = req.params.id;
  //   console.log(roll);
  const q = `SELECT * from Student where RollNo=${roll}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      //   console.log(r);
      const stud = result[0];
      const qry = `SELECT * from Jobs left join Company on Jobs.Comp_id=Company.Comp_id WHERE Jobs.JApproved=1 AND Jobs.JRejected=0 AND Type='Full-time' AND (CURDATE() BETWEEN AppOpenDate AND AppCloseDate) ORDER BY AppOpenDate DESC limit 3`;
      db.query(qry, (error, resul) => {
        if (error) throw error;
        else {
          const full = resul;
          const qr = `SELECT * from Jobs left join Company on Jobs.Comp_id=Company.Comp_id WHERE Jobs.JApproved=1 AND Jobs.JRejected=0 AND Type='Internship' AND (CURDATE() BETWEEN AppOpenDate AND AppCloseDate) ORDER BY AppOpenDate DESC limit 3`;
          db.query(qr, (error, results) => {
            if (error) throw error;
            else {
              const intern = results;
              res.render("stu/home", { stud, full, intern });
            }
          });
        }
      });
    }
  });
});

app.get("/stu/:id/jobs/ongoing", (req, res) => {
  console.log(req.params);
  const roll = req.params.id;
  //   console.log(roll);
  const q = `SELECT * from Student where RollNo=${roll}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const stud = result[0];
      const qr = `SELECT * from Jobs left join Company on Jobs.Comp_id=Company.Comp_id WHERE Jobs.JApproved=1 AND Jobs.JRejected=0 AND Type='Full-time' AND (CURDATE() BETWEEN AppOpenDate AND AppCloseDate)`;
      db.query(qr, (error, results) => {
        if (error) throw error;
        else {
          const full = results;
          res.render("stu/jobsongoing", { stud, full });
        }
      });
    }
  });
});

app.get("/stu/:id/jobs/completed", (req, res) => {
  console.log(req.params);
  const roll = req.params.id;
  //   console.log(roll);
  const q = `SELECT * from Student where RollNo=${roll}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const stud = result[0];
      const qr = `SELECT * from Jobs left join Company on Jobs.Comp_id=Company.Comp_id WHERE Jobs.JApproved=1 AND Jobs.JRejected=0 AND Type='Full-time' AND CURDATE() > AppCloseDate`;
      db.query(qr, (error, results) => {
        if (error) throw error;
        else {
          const full = results;
          //   console.log(full[1].Title);
          res.render("stu/jobscompleted", { stud, full });
        }
      });
    }
  });
});

app.get("/stu/:id/jobs/upcoming", (req, res) => {
  console.log(req.params);
  const roll = req.params.id;
  const q = `SELECT * from Student where RollNo=${roll}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const stud = result[0];
      const qr = `SELECT * from Jobs left join Company on Jobs.Comp_id=Company.Comp_id WHERE Jobs.JApproved=1 AND Jobs.JRejected=0 AND Type='Full-time' AND CURDATE() < AppOpenDate`;
      db.query(qr, (error, results) => {
        if (error) throw error;
        else {
          const full = results;
          //   console.log(full[1].Title);
          res.render("stu/jobsupcoming", { stud, full });
        }
      });
    }
  });
});

app.get("/stu/:id/interns/ongoing", (req, res) => {
  console.log(req.params);
  const roll = req.params.id;
  const q = `SELECT * from Student where RollNo=${roll}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const stud = result[0];
      const qr = `SELECT * from Jobs left join Company on Jobs.Comp_id=Company.Comp_id WHERE Jobs.JApproved=1 AND Jobs.JRejected=0 AND Type='Internship' AND (CURDATE() BETWEEN Jobs.AppOpenDate AND Jobs.AppCloseDate)`;
      db.query(qr, (error, results) => {
        if (error) throw error;
        else {
          const intern = results;
          res.render("stu/internsongoing", { stud, intern });
        }
      });
    }
  });
});

app.get("/stu/:id/interns/upcoming", (req, res) => {
  console.log(req.params);
  const roll = req.params.id;
  const q = `SELECT * from Student where RollNo=${roll}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const stud = result[0];
      const qr = `SELECT * from Jobs left join Company on Jobs.Comp_id=Company.Comp_id WHERE Jobs.JApproved=1 AND Jobs.JRejected=0 AND Type='Internship' AND CURDATE() < AppOpenDate`;
      db.query(qr, (error, results) => {
        if (error) throw error;
        else {
          const intern = results;
          res.render("stu/internsupcoming", { stud, intern });
        }
      });
    }
  });
});

app.get("/stu/:id/interns/completed", (req, res) => {
  console.log(req.params);
  const roll = req.params.id;
  const q = `SELECT * from Student where RollNo=${roll}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const stud = result[0];
      const qr = `SELECT * from Jobs left join Company on Jobs.Comp_id=Company.Comp_id WHERE Jobs.JApproved=1 AND Jobs.JRejected=0 AND Type='Internship' AND CURDATE() > AppCloseDate`;
      db.query(qr, (error, results) => {
        if (error) throw error;
        else {
          const intern = results;
          res.render("stu/internscompleted", { stud, intern });
        }
      });
    }
  });
});

app.get("/stu/:id/application-status", (req, res) => {
  const roll = req.params.id;
  const q = `SELECT * from Student where RollNo=${roll}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const stud = result[0];
      const qr = `SELECT * from Applications left join Jobs on Applications.Job_id=Jobs.Job_id WHERE RollNo=${roll}`;
      db.query(qr, (error, results) => {
        if (error) throw error;
        else {
          const job = results;
          res.render("stu/applicationstatus", { stud, job });
        }
      });
    }
  });
});

app.get("/stu/:id/profile", (req, res) => {
  const roll = req.params.id;
  const q = `SELECT * from Student where RollNo=${roll}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    const r = result;
    if (r.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      res.render("stu/profile", { stud: result[0] });
    }
  });
});

app.put("/stu/:id/profile", (req, res) => {
  const roll = req.params.id;
  const data = req.body;
  if (data.Contact === "") {
    data.Contact = "NULL";
  }
  if (data.CGPA === "") {
    data.CGPA = "NULL";
  }
  if (data.PersonalEmail === "") {
    const q = `UPDATE Student SET FirstName='${data.FirstName}',LastName='${data.LastName}',Course='${data.Course}',Department='${data.Department}',YearofPassing=${data.YearofPassing},PersonalEmail=NULL,Contact=${data.Contact},CGPA=${data.CGPA},UpdateDate=CURDATE() WHERE RollNo=${roll}`;
    db.query(q, (error, result) => {
      if (error) console.log(error);
      res.redirect(`/stu/${roll}/profile`);
    });
  } else {
    const q = `UPDATE Student SET FirstName='${data.FirstName}',LastName='${data.LastName}',Course='${data.Course}',Department='${data.Department}',YearofPassing=${data.YearofPassing},PersonalEmail='${data.PersonalEmail}',Contact=${data.Contact},CGPA=${data.CGPA},UpdateDate=CURDATE() WHERE RollNo=${roll}`;
    db.query(q, (error, result) => {
      if (error) console.log(error);
      res.redirect(`/stu/${roll}/profile`);
    });
  }
});

app.get("/stu/:id/changepassword", (req, res) => {
  const roll = req.params.id;
  const q = `SELECT * from Student where RollNo=${roll}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    const r = result;
    if (r.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      res.render("stu/changepassword", { stud: result[0] });
    }
  });
});

app.put("/stu/:id/changepassword", (req, res) => {
  const roll = req.params.id;
  const data = req.body;
  const q = `SELECT Password from Student WHERE RollNo=${roll}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    if (
      result.length > 0 &&
      result[0].Password === data.CurrPassword &&
      data.NewPassword === data.ConfPassword
    ) {
      const qr = `UPDATE Student SET Password='${data.NewPassword}' WHERE RollNo=${roll}`;
      db.query(qr, (error, result) => {
        if (error) throw error;
        res.redirect("/stu/login");
      });
    } else {
      res.send("Incorrect Password");
    }
  });
});

app.get("/stu/:id1/apply/:id2", (req, res) => {
  const roll = req.params.id1;
  const jo = req.params.id2;
  const q = `SELECT * from Student where RollNo=${roll}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const stud = result[0];
      const qr = `SELECT * FROM Jobs WHERE Job_id=${jo}`;
      db.query(qr, (error, results) => {
        if (error) throw error;
        if (results.length <= 0) {
          res.send("Error");
          console.log("Error");
        } else {
          const job = results[0];
          res.render("stu/jobapply", { stud, job });
        }
      });
    }
  });
});

app.post("/rec/register", (req, res) => {
  const data = req.body;
  if (data.Contact === "") {
    data.Contact = null;
  }
  const q = `INSERT INTO Company VALUES(null,'${data.Name}','${data.Email}','${data.Website}','${data.Sector}','${data.Industry}','${data.CoordName}',null,${data.Contact},'${data.Address}','${data.State}',${data.Pincode},CURDATE(),'${data.Password}',CURDATE(),0,0)`;
  db.query(q, (error, result) => {
    if (error) res.send("ERROR Mail Id already registered");
    else {
      console.log(result);
      res.send(
        "Registration Successful.Please Wait Until your request has been Processed"
      );
    }
  });
});

app.post("/rec", (req, res) => {
  const data = req.body;
  const q = `SELECT Comp_id,Password from Company where Email='${data.Email}' AND Approved=1 AND Rejected=0`;
  db.query(q, (error, result) => {
    const r = result;
    if (r.length <= 0) {
      res.send("Invalid Email");
      console.log("Invalid Email");
    } else {
      console.log(r);
      if (data.Password === r[0].Password) {
        res.redirect(`/rec/${r[0].Comp_id}`);
      } else {
        res.send("Incorrect Password");
      }
    }
  });
});

app.get("/rec/:id", (req, res) => {
  const comp = req.params.id;
  const q = `SELECT * FROM Company WHERE Comp_id=${comp}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    const r = result;
    if (r.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      res.render("rec/home", { rec: result[0] });
    }
  });
});

app.get("/rec/:id/newjob", (req, res) => {
  const comp = req.params.id;
  const q = `SELECT * FROM Company WHERE Comp_id=${comp}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    const r = result;
    if (r.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      res.render("rec/newjob", { rec: result[0] });
    }
  });
});

app.post("/rec/:id/newjob", upload.single("Description"), (req, res) => {
  const comp = req.params.id;
  const data = req.body;
  if (data.CGPA === "") {
    data.CGPA = "NULL";
  }
  if (data.NoofHires === "") {
    data.NoofHires = "NULL";
  }
  const q = `INSERT INTO Jobs VALUES(NULL,'${data.Title}','${data.Workplace}','${data.Location}','${data.Type}',${data.NoofHires},${data.Salary},'${req.file.filename}',${data.BTechElg[1]},${data.MTechElg[1]},${data.BioTechElg[1]},${data.CivilElg[1]},${data.ChemicalElg[1]},${data.CSEElg[1]},${data.ECEElg[1]},${data.EEEElg[1]},${data.MechElg[1]},${data.MMEElg[1]},${data.Elg2023[1]},${data.Elg2024[1]},${data.Elg2025[1]},${data.Elg2026[1]},${data.CGPA},${data.SFR[1]},${data.WT[1]},${data.OT[1]},${data.GD[1]},${data.PI[1]},CURDATE(),0,0,NULL,NULL,NULL,${data.id},'${data.CompName}')`;
  db.query(q, (error, result) => {
    if (error) throw error;
    const r = result;
    if (r.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      res.redirect(`/rec/${comp}/postedjobs`);
    }
  });
});

app.get("/rec/:id/postedjobs", (req, res) => {
  const comp = req.params.id;
  const q = `SELECT * FROM Company WHERE Comp_id=${comp}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const rec = result[0];
      const qr = `SELECT * from Jobs left join Company on Jobs.Comp_id=Company.Comp_id WHERE Jobs.Comp_id=${comp} ORDER BY Jobs.RegDate DESC`;
      db.query(qr, (error, results) => {
        if (error) throw error;
        const job = results;
        res.render("rec/posted", { rec, job });
      });
    }
  });
});

app.get("/rec/:id1/:id2/applications", (req, res) => {
  const comp = req.params.id1;
  const jo = req.params.id2;
  const q = `SELECT * FROM Company WHERE Comp_id=${comp}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const rec = result[0];
      const qr = `SELECT * from Applications left join Student on Applications.RollNo=Student.RollNo WHERE Job_id=${jo}`;
      db.query(qr, (error, results) => {
        if (error) throw error;
        const appl = results;
        res.render("rec/applications", { rec, appl, jo });
      });
    }
  });
});

app.get("/rec/:id/profile", (req, res) => {
  const comp = req.params.id;
  const q = `SELECT * FROM Company WHERE Comp_id=${comp}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    const r = result;
    if (r.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      res.render("rec/profile", { rec: result[0] });
    }
  });
});

app.put("/rec/:id/profile", (req, res) => {
  const comp = req.params.id;
  const data = req.body;
  if (data.Contact === "") {
    data.Contact = "NULL";
  }

  if (data.AlternateEmail === "") {
    const q = `UPDATE Company SET Name='${data.Name}',Website='${data.Website}',Sector='${data.Sector}',Industry='${data.Industry}',CoordName='${data.CoordName}',Contact=${data.Contact},AlternateEmail=NULL,Address='${data.Address}',State='${data.State}',Pincode=${data.Pincode},UpdateDate=CURDATE() WHERE Comp_id=${comp}`;
    console.log(q);
    db.query(q, (error, result) => {
      if (error) console.log(error);
      res.redirect(`/rec/${comp}/profile`);
    });
  } else {
    const q = `UPDATE Company SET Name='${data.Name}',Website='${data.Website}',Sector='${data.Sector}',Industry='${data.Industry}',CoordName='${data.CoordName}',Contact=${data.Contact},AlternateEmail='${data.AlternateEmail}',Address='${data.Address}',State='${data.State}',Pincode=${data.Pincode},UpdateDate=CURDATE() WHERE Comp_id=${comp}`;
    db.query(q, (error, result) => {
      if (error) console.log(error);
      console.log(result);
      res.redirect(`/rec/${comp}/profile`);
    });
  }
});

app.get("/rec/:id/changepassword", (req, res) => {
  const comp = req.params.id;
  const q = `SELECT * from Company where Comp_id=${comp}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    const r = result;
    if (r.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      res.render("rec/changepassword", { rec: result[0] });
    }
  });
});

app.put("/rec/:id/changepassword", (req, res) => {
  const comp = req.params.id;
  const data = req.body;
  const q = `SELECT Password from Company WHERE Comp_id=${comp}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    if (
      result.length > 0 &&
      result[0].Password === data.CurrPassword &&
      data.NewPassword === data.ConfPassword
    ) {
      const qr = `UPDATE Company SET Password='${data.NewPassword}' WHERE Comp_id=${comp}`;
      db.query(qr, (error, result) => {
        if (error) throw error;
        res.redirect("/rec/login");
      });
    } else {
      res.send("Incorrect Password");
    }
  });
});

app.post("/stu/:id1/apply/:id2", upload.single("Resume"), (req, res) => {
  const data = req.body;
  const qr = `SELECT * FROM Jobs WHERE Job_id=${data.Job_id} AND JApproved=1 AND ${data.Course}Elg=1 AND ${data.Department}Elg=1 AND Elg${data.YearofPassing}=1 AND ${data.AppCGPA}>=CGPA`;
  db.query(qr, (error, results) => {
    if (error) throw error;
    else {
      if (results.length <= 0) {
        res.send(
          "You are not eligible to apply.Please Check Eligibility Criteria by Clicking On Know More"
        );
      } else {
        const q = `INSERT INTO Applications VALUES(NULL,'${req.file.filename}',NULL,${data.AppCGPA},'Application Recieved',CURDATE(),${data.id},${data.Job_id})`;
        db.query(q, (error, result) => {
          if (error) res.send("You have already applied");
          else {
            const qry = `SELECT * FROM Applications WHERE RollNo=${data.id} AND Job_id=${data.Job_id}`;
            db.query(qry, (error, resu) => {
              if (error) throw error;
              else {
                const desfile = `${results[0].Desfile}`;
                const resumefile = `${resu[0].Resume}`;
                const child = spawn("python3", [
                  "Resume.py",
                  desfile,
                  resumefile,
                ]);
                let dat;
                child.stdout.on("data", (data) => {
                  dat = data.toString();
                });
                child.on("close", (code) => {
                  console.log(dat);
                  console.log(
                    `child process close all stdio with code ${code}`
                  );
                  const qery = `UPDATE Applications SET Score='${dat}' WHERE App_id=${resu[0].App_id}`;
                  db.query(qery, (error, resl) => {
                    if (error) throw error;
                    else {
                      res.redirect(`/stu/${data.id}/application-status`);
                    }
                  });
                });
              }
            });
          }
        });
      }
    }
  });
});

app.post("/admin", (req, res) => {
  const data = req.body;
  const q = `SELECT Emp_id,Password from Admins where Email='${data.Email}'`;
  db.query(q, (error, result) => {
    const r = result;
    if (r.length <= 0) {
      res.send("Invalid Email");
      console.log("Invalid Email");
    } else {
      console.log(r);
      if (data.Password === r[0].Password) {
        res.redirect(`/ad/${r[0].Emp_id}`);
      } else {
        res.send("Incorrect Password");
      }
    }
  });
});

app.get("/ad/:id", (req, res) => {
  const emp = req.params.id;
  const q = `SELECT * from Admins where Emp_id=${emp}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const adm = result[0];
      const qry = `SELECT * from Jobs left join Company on Jobs.Comp_id=Company.Comp_id WHERE Jobs.JApproved=0 AND Jobs.JRejected=0 ORDER BY Jobs.RegDate DESC limit 3`;
      db.query(qry, (error, resul) => {
        if (error) throw error;
        else {
          const job = resul;
          const qr = `SELECT * from Company WHERE Approved=0 AND Rejected=0 ORDER BY RegDate DESC limit 3`;
          db.query(qr, (error, results) => {
            if (error) throw error;
            else {
              const rec = results;
              res.render("admin/home", { adm, rec, job });
            }
          });
        }
      });
    }
  });
});

app.post("/ad/:id1/recapp/:id2", (req, res) => {
  const ad = req.params.id1;
  const comp = req.params.id2;
  const q = `SELECT * from Admins where Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (result.length <= 0) {
      res.send("Error");
    } else {
      const adm = result[0];
      const qr = `UPDATE Company SET Approved=1,Rejected=0 WHERE Comp_id=${comp}`;
      db.query(qr, (error, results) => {
        if (error) res.send("Cannot Approve");
        else {
          res.redirect(`/ad/${adm.Emp_id}/recruiters/all`);
        }
      });
    }
  });
});

app.post("/ad/:id1/recrej/:id2", (req, res) => {
  const ad = req.params.id1;
  const comp = req.params.id2;
  const q = `SELECT * from Admins where Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const adm = result[0];
      const qr = `UPDATE Company SET Rejected=1,Approved=0 WHERE Comp_id=${comp}`;
      db.query(qr, (error, results) => {
        if (error) res.send("Cannot Approve");
        else {
          res.redirect(`/ad/${adm.Emp_id}/recruiters/all`);
        }
      });
    }
  });
});

app.get("/ad/:id/recruiters/all", (req, res) => {
  const ad = req.params.id;
  const q = `SELECT * from Admins where Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const adm = result[0];
      const qr = `SELECT * FROM COMPANY ORDER BY RegDate DESC`;
      db.query(qr, (error, results) => {
        if (error) res.send("ERROR");
        else {
          const rec = results;
          res.render("admin/allrecs", { adm, rec });
        }
      });
    }
  });
});

app.post("/ad/:id1/jobrej/:id2", (req, res) => {
  const ad = req.params.id1;
  const jo = req.params.id2;
  const q = `SELECT * from Admins where Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const adm = result[0];
      const qr = `UPDATE Jobs SET JRejected=1 WHERE Job_id=${jo}`;
      db.query(qr, (error, results) => {
        if (error) res.send("ERROR");
        else {
          const job = results[0];
          res.redirect(`/ad/${adm.Emp_id}/jobs/all`);
        }
      });
    }
  });
});

app.get("/ad/:id1/jobapp/:id2", (req, res) => {
  const ad = req.params.id1;
  const jo = req.params.id2;
  //   console.log(req.body);
  //   const data = req.body;
  const q = `SELECT * from Admins where Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const adm = result[0];
      const qr = `SELECT * FROM Jobs WHERE Job_id=${jo}`;
      db.query(qr, (error, results) => {
        if (error) res.send("ERROR");
        else {
          const job = results[0];
          res.render("admin/jobapprove", { adm, job });
        }
      });
    }
  });
});

app.get("/ad/:id/jobs/all", (req, res) => {
  const ad = req.params.id;
  //   console.log(req.body);
  //   const data = req.body;
  const q = `SELECT * from Admins where Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const adm = result[0];
      const qr = `SELECT * from Jobs left join Company on Jobs.Comp_id=Company.Comp_id ORDER BY Jobs.RegDate DESC`;
      db.query(qr, (error, results) => {
        if (error) res.send("ERROR");
        else {
          const job = results;
          res.render("admin/alljobs", { adm, job });
        }
      });
    }
  });
});

app.post("/ad/:id1/jobapp/:id2", (req, res) => {
  const ad = req.params.id1;
  const jo = req.params.id2;
  // console.log(req.body);
  const data = req.body;
  const q = `SELECT * from Admins where Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const adm = result[0];
      const qr = `UPDATE Jobs SET JApproved=1,JRejected=0,AppOpenDate='${data.AppOpenDate}',AppCloseDate='${data.AppCloseDate}' WHERE Job_id=${jo}`;
      db.query(qr, (error, results) => {
        if (error) res.send("ERROR");
        else {
          res.redirect(`/ad/${adm.Emp_id}/jobs/all`);
        }
      });
    }
  });
});

app.get("/ad/:id1/jobedit/:id2", (req, res) => {
  const ad = req.params.id1;
  const jo = req.params.id2;
  //   console.log(req.body);
  //   const data = req.body;
  const q = `SELECT * from Admins where Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const adm = result[0];
      const qr = `SELECT * FROM Jobs WHERE Job_id=${jo}`;
      db.query(qr, (error, results) => {
        if (error) res.send("ERROR");
        else {
          const job = results[0];
          res.render("admin/jobeditdate", { adm, job });
        }
      });
    }
  });
});

app.put("/ad/:id1/jobedit/:id2", (req, res) => {
  const ad = req.params.id1;
  const jo = req.params.id2;
  console.log(req.body);
  const data = req.body;
  const q = `SELECT * from Admins where Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const adm = result[0];
      const qr = `UPDATE Jobs SET AppOpenDate='${data.AppOpenDate}',AppCloseDate='${data.AppCloseDate}' WHERE Job_id=${jo}`;
      db.query(qr, (error, results) => {
        if (error) res.send("ERROR");
        else {
          res.redirect(`/ad/${adm.Emp_id}/jobs/all`);
        }
      });
    }
  });
});

app.get("/ad/:id/recruiters/req", (req, res) => {
  const ad = req.params.id;
  //   console.log(req.body);
  //   const data = req.body;
  const q = `SELECT * from Admins where Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const adm = result[0];
      const qr = `SELECT * FROM Company WHERE Approved=0 AND Rejected=0`;
      db.query(qr, (error, results) => {
        if (error) res.send("ERROR");
        else {
          const rec = results;
          res.render("admin/reqrecs", { adm, rec });
        }
      });
    }
  });
});

app.get("/ad/:id/jobs/req", (req, res) => {
  const ad = req.params.id;
  //   console.log(req.body);
  //   const data = req.body;
  const q = `SELECT * from Admins where Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const adm = result[0];
      const qr = `SELECT * from Jobs left join Company on Jobs.Comp_id=Company.Comp_id WHERE JApproved=0 AND JRejected=0`;
      db.query(qr, (error, results) => {
        if (error) res.send("ERROR");
        else {
          const job = results;
          res.render("admin/reqjobs", { adm, job });
        }
      });
    }
  });
});

app.get("/ad/:id1/postedjobs", (req, res) => {
  const ad = req.params.id1;
  const comp = req.query.compid;
  // console.log(comp);
  //   console.log(req.body);
  //   const data = req.body;
  const q = `SELECT * from Admins where Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const adm = result[0];
      const qr = `SELECT * FROM Jobs left join Company on Jobs.Comp_id=Company.Comp_id WHERE Jobs.Comp_id=${comp} ORDER BY Jobs.RegDate DESC`;
      db.query(qr, (error, results) => {
        if (error) throw error;
        else {
          const job = results;
          res.render("admin/jobsposted", { adm, job });
        }
      });
    }
  });
});

app.get("/ad/:id1/applications", (req, res) => {
  const ad = req.params.id1;
  const jo = req.query.jobid;
  console.log(req.body);
  //   const data = req.body;
  const q = `SELECT * from Admins where Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const adm = result[0];
      const qr = `SELECT * FROM Applications left join Student on Applications.RollNo=Student.RollNo WHERE Applications.Job_id=${jo} ORDER BY Applications.AppDate DESC`;
      db.query(qr, (error, results) => {
        if (error) throw error;
        else {
          const appl = results;
          res.render("admin/jobapplications", { adm, appl });
        }
      });
    }
  });
});

app.get("/ad/:id/students", (req, res) => {
  const ad = req.params.id;
  //   console.log(req.body);
  //   const data = req.body;
  const q = `SELECT * from Admins where Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const adm = result[0];
      const qr = `SELECT * FROM Student ORDER BY RegDate DESC`;
      db.query(qr, (error, results) => {
        if (error) throw error;
        else {
          const stud = results;
          res.render("admin/students", { adm, stud });
        }
      });
    }
  });
});

app.get("/ad/:id1/jobsapp", (req, res) => {
  const ad = req.params.id1;
  const roll = req.query.rollno;
  //   console.log(req.body);
  //   const data = req.body;
  const q = `SELECT * from Admins where Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const adm = result[0];
      const qr = `SELECT * FROM Applications left join Jobs on Applications.Job_id=Jobs.Job_id WHERE Applications.RollNo=${roll} ORDER BY Applications.AppDate DESC`;
      db.query(qr, (error, results) => {
        if (error) throw error;
        else {
          const job = results;
          res.render("admin/appliedjobs", { adm, job, roll });
        }
      });
    }
  });
});

app.put("/ad/:id1/appstatus/:id2", (req, res) => {
  const ad = req.params.id1;
  const app = req.params.id2;
  //   console.log(req.body);
  const data = req.body;
  const q = `SELECT * from Admins where Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const adm = result[0];
      const qr = `UPDATE Applications SET Status='${data.Status}' WHERE App_id=${app}`;
      db.query(qr, (error, results) => {
        if (error) throw error;
        else {
          res.redirect(`/ad/${ad}/jobsapp?rollno=${data.RollNo}`);
        }
      });
    }
  });
});

app.put("/ad/:id1/jappstatus/:id2", (req, res) => {
  const ad = req.params.id1;
  const app = req.params.id2;
  //   console.log(req.body);
  const data = req.body;
  const q = `SELECT * from Admins where Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const adm = result[0];
      const qr = `UPDATE Applications SET Status='${data.Status}' WHERE App_id=${app}`;
      db.query(qr, (error, results) => {
        if (error) throw error;
        else {
          res.redirect(`/ad/${ad}/applications?jobid=${data.Job_id}`);
        }
      });
    }
  });
});

app.get("/ad/:id/profile", (req, res) => {
  const ad = req.params.id;
  //   console.log(comp);
  const q = `SELECT * FROM Admins WHERE Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    const r = result;
    if (r.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      res.render("admin/profile", { adm: result[0] });
    }
  });
});

app.put("/ad/:id/profile", (req, res) => {
  //   console.log(req.params);
  const ad = req.params.id;
  const data = req.body;
  console.log(ad);
  console.log(data);
  if (data.Contact === "") {
    data.Contact = "NULL";
    console.log(data.Contact);
  }
  if (data.PersonalMail === "") {
    console.log(data.PersonalMail);
    const q = `UPDATE Admins SET FirstName='${data.FirstName}',LastName='${data.LastName}',Designation='${data.Designation}',Dept='${data.Dept}',PersonalMail=NULL,Contact=${data.Contact} WHERE Emp_id=${ad}`;
    console.log(q);
    db.query(q, (error, result) => {
      if (error) console.log(error);
      console.log(result);
      res.redirect(`/ad/${ad}/profile`);
    });
  } else {
    const q = `UPDATE Admins SET FirstName='${data.FirstName}',LastName='${data.LastName}',Designation='${data.Designation}',Dept='${data.Dept}',PersonalMail='${data.PersonalMail}',Contact=${data.Contact} WHERE Emp_id=${ad}`;
    console.log(q);
    db.query(q, (error, result) => {
      if (error) console.log(error);
      console.log(result);
      res.redirect(`/ad/${ad}/profile`);
    });
  }
});

app.get("/ad/:id/changepassword", (req, res) => {
  const ad = req.params.id;
  //   console.log(roll);
  const q = `SELECT * from Admins where Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    const r = result;
    if (r.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      //   console.log(r);
      res.render("admin/changepassword", { adm: result[0] });
    }
  });
});

app.put("/ad/:id/changepassword", (req, res) => {
  const ad = req.params.id;
  const data = req.body;
  console.log(data);
  console.log(ad);
  const q = `SELECT Password from Admins WHERE Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    if (
      result.length > 0 &&
      result[0].Password === data.CurrPassword &&
      data.NewPassword === data.ConfPassword
    ) {
      const qr = `UPDATE Admins SET Password='${data.NewPassword}' WHERE Emp_id=${ad}`;
      db.query(qr, (error, result) => {
        if (error) throw error;
        res.redirect("/admin/login");
      });
    } else {
      res.send("Incorrect Password");
    }
  });
});

app.get("/ad/:id1/schedule", (req, res) => {
  const ad = req.params.id1;
  const jobid = req.query.jobid;
  //   console.log(req.body);
  //   const data = req.body;
  const q = `SELECT * from Admins where Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const adm = result[0];
      const qr = `SELECT * FROM Events left join Jobs on Events.Job_id=Jobs.Job_id WHERE Events.Job_id=${jobid} ORDER BY Events.EveRegDate DESC`;
      db.query(qr, (error, results) => {
        if (error) throw error;
        else {
          const eve = results;
          res.render("admin/events", { adm, eve, jobid });
        }
      });
    }
  });
});

app.post("/ad/:id1/:id2/newevent", (req, res) => {
  const ad = req.params.id1;
  const jobid = req.params.id2;
  console.log(req.body);
  const data = req.body;
  const q = `SELECT * from Admins where Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const adm = result[0];
      const qr = `INSERT INTO Events VALUES(NULL,'${data.EveName}','${data.EveDate}','${data.EveTime}','${data.EveVenue}',CURDATE(),${jobid})`;
      db.query(qr, (error, results) => {
        if (error) res.send("ERROR");
        else {
          res.redirect(`/ad/${adm.Emp_id}/schedule?jobid=${jobid}`);
        }
      });
    }
  });
});

app.put("/ad/:id1/:id2/edit", (req, res) => {
  const ad = req.params.id1;
  const eveid = req.params.id2;
  const data = req.body;
  const q = `SELECT * from Admins where Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const adm = result[0];
      const qr = `UPDATE Events SET EveDate='${data.EveDate}',EveTime='${data.EveTime}',EveVenue='${data.EveVenue}' WHERE Event_id=${eveid}`;
      db.query(qr, (error, results) => {
        if (error) throw error;
        else {
          res.redirect(`/ad/${adm.Emp_id}/schedule?jobid=${data.Job_id}`);
        }
      });
    }
  });
});

app.delete("/ad/:id1/:id2/delete", (req, res) => {
  const ad = req.params.id1;
  const eveid = req.params.id2;
  const data = req.body;
  const q = `SELECT * from Admins where Emp_id=${ad}`;
  db.query(q, (error, result) => {
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const adm = result[0];
      const qr = `DELETE FROM Events WHERE Event_id=${eveid}`;
      db.query(qr, (error, results) => {
        if (error) throw error;
        else {
          res.redirect(`/ad/${adm.Emp_id}/schedule?jobid=${data.Job_id}`);
        }
      });
    }
  });
});

app.get("/stu/:id1/:id2/schedule", (req, res) => {
  const roll = req.params.id1;
  const jobid = req.params.id2;
  console.log(roll);
  const q = `SELECT * from Student where RollNo=${roll}`;
  db.query(q, (error, result) => {
    if (error) throw error;
    if (result.length <= 0) {
      res.send("Error");
      console.log("Error");
    } else {
      const stud = result[0];
      const qr = `SELECT * FROM Events WHERE Job_id=${jobid}`;
      db.query(qr, (error, results) => {
        if (error) throw error;
        else {
          const eve = results;
          res.render("stu/schedule", { stud, eve, jobid });
        }
      });
    }
  });
});

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});
