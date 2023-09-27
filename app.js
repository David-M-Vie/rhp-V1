const windowHeight = window.innerHeight;

/* ====================================
 Navigation, scrolling to next section  
======================================= */ 
const scrollDown = () => {
  window.scrollBy({
    top: windowHeight,
    behavior: "smooth",
  });
}

/* ===============
       State
================== */
const state = {
  startDate: {dte: null,  isVerified: false},
  endDate: {dte: null, isVerified: false},
  decisionDate: {dte: null, isVerified: false},
  additionalDays: {days: null, isVerified: false},
  apEnd: {dte: null, isVerified: false},
  sanctionLength: null
}


/* =================
  CHECK VALID DATE
====================*/
// Takes in an input value and returns either a Date,  or string "Invalid Date"
const createDate = (input) => {
  const dte = new Date(`${input}`);
  if(dte.toString() === "Invalid Date"){
    return "Invalid Date"
  }else {
    return dte
  }
}

/* ===============
  EVENT LISTENERS 
================== */

// Set the values of the startDate, endDate, and additionalDays inputs 
//  any time an input is adjusted it's no longer verified, and needs to run through validation again when the calculate button is pressed 
//

document.querySelector('#failDate').addEventListener("keyup", (e) => {
  state.startDate.dte = e.target.value;
  state.startDate.isVerified = false;
})

document.querySelector('#liftedDate').addEventListener('keyup', (e) => {
  state.endDate.dte = e.target.value;
  state.endDate.isVerified = false
})

document.querySelector('#additionalDays').addEventListener('blur', (e) => {
  state.additionalDays.days = Number(e.target.value);
  state.additionalDays.isVerified = false;
})

document.querySelector('#additionalDays').addEventListener('click', (e) => {
  state.additionalDays.days = Number(e.target.value);
  state.additionalDays.isVerified = false;
})

/* ==================================================
 SECTION 1 CALCULATE / NEXT BUTTON - VALIDATE INPUTS 
 ==================================================== */
document.querySelector('#btn-1').addEventListener("click", () => {

  // set an errors array
  const errorMsg = [];

  if(state.startDate.isVerified && state.endDate.isVerified && state.additionalDays.isVerified) {
    scrollDown();
  }else {
    // use the input to attempt to create a valid JS Date obj
    const startDate = createDate(state.startDate.dte);
    if(startDate === "Invalid Date") {
      errorMsg.push("Date of failure is not a valid date");
      state.startDate.isVerified = false;
    }else {
      // set the JS Date object on state
      state.startDate.dte = startDate;
      state.startDate.isVerified = true;
    }

    const endDate = createDate(state.endDate.dte);
    if(endDate === "Invalid Date") {
      errorMsg.push("Date sanction lifted is not a valid date");
      state.endDate.isVerified = false;

    }else {
      state.endDate.dte = endDate;
      state.endDate.isVerified = true;
    }

    if(state.additionalDays.days === 0 || state.additionalDays.days === null) {
      errorMsg.push("No additional days selected, 7 or 14.");
      state.additionalDays.isVerified = false
    }else {
      state.additionalDays.isVerified = true
    }


    if(errorMsg.length > 0) {
      const output = document.querySelector('#output-1');
      let html = `<ul class="red-box">`
      html += `<span class="close-error-box">x</span>`
      for(let i = 0; i < errorMsg.length; i++) {
        html += `<li>${errorMsg[i]}</li>`
      }
      html += "</ul>"
      output.innerHTML = html;
      document.querySelector('.close-error-box').addEventListener("click", () => {
        output.innerHTML = ""
      })
    }else {
      document.querySelector('#btn-1').textContent="Next"
      document.querySelector('#btn-1').classList.replace('calc', 'next')
      document.querySelector('#output-1').innerHTML = ""

      // Calculate the difference between start and end days and add on the additional days
      const totalDays = getTotalDays(state.startDate.dte, state.endDate.dte, state.additionalDays.days)
      state.sanctionLength = totalDays;
      const output = document.querySelector('#output-1')
      output.innerHTML = `
        <p class="blue-box">Sanction applies for ${state.sanctionLength} days</p>
      `
    }

  }   
 

});



/* ===================================================
 SECTION 2 CALCULATE DECISION DATE, AND AP END DATE
====================================================== */
// document.querySelector('#decisionDate').addEventListener("keyup", (e) => {
//   state.decisionDate.dte = e.target.value;
//   state.decisionDate.isVerified = false;
// })

// any time the apEnd input is altered and moved off fire the event to save it's value in state,  ( which will then be validated when the users presses "calculate" )
document.querySelector('#apEnd').addEventListener('blur', (e) => {
  state.apEnd.dte = e.target.value;
  state.apEnd.isVerified = false;
})

document.querySelector('#btn-2').addEventListener("click", () => {
  // set an errors array;
  const errorMsg = [];

  if(apEnd.isVerified){
    // do something 
  }else { // attempt to verify it. 
    // use the input to attempt to create a valid JS Date object.
    const apEndDate = createDate(state.apEnd.dte)
    if(apEndDate === "Invalid Date") {
      errorMsg.push("The assessment period date is not valid, please try again.");
      state.apEnd.isVerified = false;
    }else {
      // Set the JS Date Object on state.
      state.apEnd.dte = apEndDate;
      state.apEnd.isVerified = true;
    }
  }

  console.log(state)

  if(errorMsg.length > 0) {
    const output = document.querySelector('#output-2');
    let html = `<ul class="red-box">`;
    html += `<span class="close-error-box">x</span>`
    for(let i = 0; i < errorMsg.length; i++) {
      html += `<li>${errorMsg[i]}</li>`
    }
    html += "</ul>"
    output.innerHTML = html;
    document.querySelector('.close-error-box').addEventListener("click", () => {
      output.innerHTML = ""
    })
  }else {
    document.querySelector('#output-2').innerHTML = ""
    scrollDown()
  }
})



 
/*
@PARAMS:   startDate    JS Date Obj   
@PARAMS:   endDate      JS Date Obj 
@PARAMS:   addDays      Number
*/
const getTotalDays = (startDate, endDate, addDays) => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

  const totalDays = Math.round(Math.abs((endDate - startDate) / oneDay));

  return totalDays + addDays
}




/* SCROLLING SECTION NAVIGATION */


// document.querySelector('#startAgain').addEventListener("click", () => {
//   scrollTo({
//     top: "0px",
//     behavior: "smooth"
//   });
// });