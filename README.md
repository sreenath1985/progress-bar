<h2>Description<h2>

This progress bar is created using plain Javascript works responsive in mobile, tablet, Desktop, etc. 

1. Multiple bars created based on the API response
2. One set of controls that will control each bar on the fly
3. Progress will not go under 0
4. Bar will go over limit (defined in API), but limit the bar itself and change its colour
5. Responsive progress bar will works perfectly in mobile, tablet, desktop, etc.

<h2>Usage<h2>

document.addEventListener("DOMContentLoaded", function(event) { 
    progressBarDemo.initialize();
});

  <h4>Fetch data from API <h4>
  
    function fetchAPIResponse() {
        var xhr = new XMLHttpRequest;
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                postFetchResponse(JSON.parse(this.responseText));
            }
        };
        xhr.onerror = function () {
            reject(new TypeError('Local request failed'))
        };
        xhr.open('GET', progressBarEndPointURL);
        xhr.send(null);
    }
    
    /*This function is to generate progress bar*/
    function generateProgressBarsHTML(barsResponse, barLimit) {
        var progressBarsHTML = [],
            barsResponseLength = barsResponse.length,
            barLimit = typeof barLimit !== "undefined" ? barLimit : 0,
            barWidth = 0;

        for (var i = 0; i < barsResponseLength; i++) {

            if (barsResponse[i] > 0) {
               barWidth = barsResponse[i];
            }
            progressBarsHTML.push(`
                <div class="row">
                   <div class="col-md-12">
                        <div data-limit = "`+ barLimit + `" data-value="` + barWidth + `" class=" ProgressBarDemo-bar">
                            <span class="ProgressBarDemo-barFill" style="width: ` + barWidth + `%"> </span>
                            <div class="text-center ProgressBarDemo-barPercent">` + barWidth + `% </div>
                        </div>
                    </div>
                </div>
            `);

        }

        return progressBarsHTML;
    }
    
    
    
    /*This function is to control the progress bar*/
    function modifyProgressBar(buttonValue) {

        var selectedProgressBar = parseInt(document.getElementById('progressBarDropdown').value),
            selectedProgressBarCurrentValue,
            modifiedPercentageValue,
            barLimit,
            modifiedFillWidth;

        selectedProgressBarCurrentValue = parseInt(document.getElementsByClassName('ProgressBarDemo-bar')[selectedProgressBar].getAttribute('data-value'));
        barLimit = parseInt(document.getElementsByClassName('ProgressBarDemo-bar')[selectedProgressBar].getAttribute('data-limit'));
        //To get Min value against the limit
		modifiedPercentageValue = (Math.min(barLimit, (selectedProgressBarCurrentValue + parseInt(buttonValue))));
		
        if (modifiedPercentageValue < 0) {
            modifiedPercentageValue = 0;
        }
        modifiedFillWidth = modifiedPercentageValue;
        if (modifiedFillWidth > 100) {
            modifiedFillWidth = 100;
			document.getElementsByClassName('ProgressBarDemo-bar')[selectedProgressBar].getElementsByClassName('ProgressBarDemo-barFill')[0].classList.add('ProgressBarDemo-barFill-Red');
        }else{
			document.getElementsByClassName('ProgressBarDemo-bar')[selectedProgressBar].getElementsByClassName('ProgressBarDemo-barFill')[0].classList.remove('ProgressBarDemo-barFill-Red');
		}
		
		
        document.getElementsByClassName('ProgressBarDemo-bar')[selectedProgressBar].setAttribute('data-value', modifiedPercentageValue);

        document.getElementsByClassName('ProgressBarDemo-bar')[selectedProgressBar].getElementsByClassName('ProgressBarDemo-barFill')[0].style.width = modifiedFillWidth + '%';

        document.getElementsByClassName('ProgressBarDemo-bar')[selectedProgressBar].getElementsByClassName('ProgressBarDemo-barPercent')[0].innerHTML = modifiedPercentageValue + '%';

    }
    
    
