var progressBarDemo = (function () {
    var progressBarEndPointURL = 'http://pb-api.herokuapp.com/bars';
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

	/* This function is to generate bar based on response*/

    function generateBarsDropdown(barsResponse) {
        var barsDropdownHTML = [],
            barsResponseLength = barsResponse.length;

        barsDropdownHTML.push(' <select id="progressBarDropdown" class="form-control">');

        for (var i = 0; i < barsResponseLength; i++) {
            barsDropdownHTML.push(' <option value="' + i + '"> Progress Bar ' + (i + 1) + '</option>');
        }

        barsDropdownHTML.push('</select>');

        return barsDropdownHTML;

    }
	
	/*This function is to control the Bar */
    function generateBarControlHTML(buttonsResponse, barsResponse) {
        var progressBarsControlButtonsHTML = [];

        progressBarsControlButtonsHTML.push(`
                <div class="row">
                    <div class="col-sm-6">`

            + generateBarsDropdown(barsResponse) +
            `</div>
                    <div class="col-sm-6 btn-group ProgressBarDemo-control-buttons text-center">`
            + generateButtons(buttonsResponse) +
            `</div>
                </div>
        `);

        return progressBarsControlButtonsHTML;
    }
	/* This function is to generate BUttons based on the API*/
    function generateButtons(buttonsResponse) {
        var buttonsHTML = [],
            buttonsResponseLength = buttonsResponse.length;

        for (var j = 0; j < buttonsResponseLength; j++) {
            buttonsHTML.push('<button onClick="javascript: progressBarDemo.modifyProgressBar(' + buttonsResponse[j] + ')" class="btn btn-default">' + buttonsResponse[j] + '</button>');
        }

        return buttonsHTML;
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
	
	/*This function is to trigger progress bar and bar control based on the API */
    function generateHTML(progressBarAPIResponse) {
        var buttonsResponse = progressBarAPIResponse.buttons,
            barsResponse = progressBarAPIResponse.bars,
            barLimit = progressBarAPIResponse.limit;

        if (buttonsResponse && buttonsResponse.length && barsResponse && barsResponse.length) {
            document.getElementById('ProgressBarDemo-innerWrapper').insertAdjacentHTML('beforeend', generateProgressBarsHTML(barsResponse, barLimit) + generateBarControlHTML(buttonsResponse, barsResponse));
        }
    }

    function postFetchResponse(progressAPIResponse) {
        generateHTML(progressAPIResponse);
    }
	/* This function is to fetch the updae*/
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
    return {
        initialize: () => fetchAPIResponse(),
        modifyProgressBar: (buttonValue) => modifyProgressBar(buttonValue)
    };

})();