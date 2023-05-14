(function(){

var $  = document.getElementById.bind(document);
var $$ = document.querySelectorAll.bind(document);

var App = function($el){
  this.$el = $el;
  this.load();

  this.$el.addEventListener(
    'submit', this.submit.bind(this)
  );

  if (this.dob) {
    this.renderAgeLoop();
  } else {
    this.renderChoose();
  }
};

App.fn = App.prototype;

App.fn.load = function(){
  var value;

  if (value = localStorage.dob)
    this.dob = new Date(parseInt(value));
};

App.fn.save = function(){
  if (this.dob)
    localStorage.dob = this.dob.getTime();
};

App.fn.submit = function(e){
  e.preventDefault();

  var input = this.$$('input')[0];
  if ( !input.valueAsDate ) return;

  this.dob = input.valueAsDate;
  this.save();
  this.renderAgeLoop();
};

App.fn.renderChoose = function(){
  this.html(this.view('dob')());
};

App.fn.renderAgeLoop = function(){
  this.interval = setInterval(this.renderAge.bind(this), 100);
};

App.fn.renderAge = function(){
  var now       = new Date()
  var duration  = now - this.dob;
  var years     = duration / 31556900000;
  var majorMinor = years.toFixed(9).toString().split('.');

  const nextYear = now.getFullYear() + 1;
  const targetNextDate = new Date(`January 1, ${nextYear} 00:00:00`);
  const timeDiff = targetNextDate.getTime() - now.getTime();
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  const months = ((targetNextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.44)).toFixed(3);
  const weeks = ((targetNextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7)).toFixed(3);

  const biggerTargetYear = 2030;
  const targetDate = new Date(`January 1, ${biggerTargetYear} 00:00:00`);
  const timeDiffBiggerYear = (targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  const daysBiggerTargetYear = Math.round(timeDiffBiggerYear);

  requestAnimationFrame(function(){
    this.html(this.view('age')({
      year:         majorMinor[0],
      milliseconds: majorMinor[1],
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
      months: months,
      weeks: weeks,
      biggerTargetYear: biggerTargetYear,
      daysBiggerTargetYear: daysBiggerTargetYear
    }));
  }.bind(this));
};

App.fn.$$ = function(sel){
  return this.$el.querySelectorAll(sel);
};

App.fn.html = function(html){
  this.$el.innerHTML = html;
};

App.fn.view = function(name){
  var $el = $(name + '-template');
  return Handlebars.compile($el.innerHTML);
};

window.app = new App($('app'))

})();
