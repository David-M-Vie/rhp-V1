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
  dateOfFail: {dte: null,  isVerified: false},
  dateComplied: {dte: null, isVerified: false},
  decisionDate: {dte: null, isVerified: false},
  additionalDays: {days: null, isVerified: false},
  apEnd: {dte: null, isVerified: false},
  sanctionLength: null
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]



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

// Set the values of the dateOfFail, dateComplied, and additionalDays inputs 
//  any time an input is adjusted it's no longer verified, and needs to run through validation again when the calculate button is pressed 
//


document.querySelector('#failDate').addEventListener("keyup", (e) => {
  state.dateOfFail.dte = e.target.value;
  state.dateOfFail.isVerified = false;
})

document.querySelector('#liftedDate').addEventListener('keyup', (e) => {
  state.dateComplied.dte = e.target.value;
  state.dateComplied.isVerified = false
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

  if(state.dateOfFail.isVerified && state.dateComplied.isVerified && state.additionalDays.isVerified) {
    scrollDown();
  }else {
    // use the input to attempt to create a valid JS Date obj
    const dateOfFail = createDate(state.dateOfFail.dte);
    if(dateOfFail === "Invalid Date") {
      errorMsg.push("Date of failure is not a valid date");
      state.dateOfFail.isVerified = false;
    }else {
      // set the JS Date object on state
      state.dateOfFail.dte = dateOfFail;
      state.dateOfFail.isVerified = true;
    }

    const dateComplied = createDate(state.dateComplied.dte);
    if(dateComplied === "Invalid Date") {
      errorMsg.push("Date sanction lifted is not a valid date");
      state.dateComplied.isVerified = false;

    }else {
      state.dateComplied.dte = dateComplied;
      state.dateComplied.isVerified = true;
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
      const totalDays = getTotalDays(state.dateOfFail.dte, state.dateComplied.dte, state.additionalDays.days)
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
document.querySelector('#decisionDate').addEventListener("blur", (e) => {
  state.decisionDate.dte = e.target.value;
  state.decisionDate.isVerified = false;
})

// any time the apEnd input is altered and moved off fire the event to save it's value in state,  ( which will then be validated when the users presses "calculate" )
document.querySelector('#apEnd').addEventListener('blur', (e) => {
  state.apEnd.dte = e.target.value;
  state.apEnd.isVerified = false;
})

// When the page 2 red calculate button is clicked. 
document.querySelector('#btn-2').addEventListener("click", () => {
  // set an errors array;
  const errorMsg = [];

  if(!state.dateOfFail.isVerified || !state.dateComplied.isVerified) {
    errorMsg.push('Scroll back up and complete Section 1!')
  }

  if(apEnd.isVerified && decisionDate.isVerified && dateOfFail.isVerified && dateComplied.isVerified){
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

    const decisionDate = createDate(state.decisionDate.dte);
    if(decisionDate === "Invalid Date") {
      errorMsg.push("The Decision Date is not valid, please try again.");
      state.decisionDate.isVerified = false;
    }else {
      // Set the decision date on state
      state.decisionDate.dte = decisionDate;
      state.decisionDate.isVerified = true
    }
  }

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
    document.querySelector('#output-1').innerHTML = "";
    document.querySelector('#output-2').innerHTML = "";
    scrollDown()
    // Calculate when sanction applies from, runs to and RHP dates

    let endDate = state.apEnd.dte;
  
    let day = endDate.getDate();
    let monthNumber = endDate.getMonth();
    let month = months[monthNumber]
    let year = endDate.getFullYear();
    
    // console.log('day', day);
    // console.log('monthNumber', monthNumber);
    // console.log('month', month);
    // console.log('Year', year,  'typeof year', typeof year)

    let apStartDate;

    switch(month) {
      case 'January':
        let prevMonth = monthNumber === 0 ? 12 : monthNumber - 1;
        // it's 12 above because when creating a new date is 1-12 for months,  DON'T CONFUSE THIS WITH THE ARRAY INDEXING MONTHS FROM 0 - 11 !!
        if(day > 0 && day < 31) {
          apStartDate = new Date(`${(year - 1)}-${prevMonth}-${(day + 1)}`)
        }
    }

    console.log('apStartDate', apStartDate)

    




    setTimeout(() => {
      document.querySelector('.result-box').innerHTML = `
        <div class="result-text">
            <p> This sanction applies for a total of <strong>${state.sanctionLength} days</strong> 
            


            They can apply for a recoverable hardship payment on the following dates: 
            <ul>
                <li> date 1 </li>
                <li> date 2 </li>
                <li> date 3 </li>
            </ul>
        </div>
      `
      console.log(state)
    },300)
  }
})

/*
    from ${new Date(apStartDateOfDecision).toLocaleDateString()} for ${state.sanctionLength} days  (this includes the additional fixed ${state.additionalDays.days} days).</p>
*/


 
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