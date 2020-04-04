export function convertGSTTToSRT(string: string) {
    class hourRepresentation {
        private hours: number;
        private minutes: number;
        private seconds: number;
        private nanos: string; // nanoSeconds are beter as string since we do not opperate with them,
        constructor(input: string | speechV2TimeRepresentation) {
            let seconds, nanos: string;
            if (determineIfv2(input)) {
                seconds = input.seconds || '0';
                this.nanos = input.substring(input.length -3, 3) ;
            } else {
                seconds = input.substring(0, input.length - 1);
                this.nanos = input.substring(input.length -3, 3); // servide doesn't return nanoseconds on v1
            }
            this.seconds = +seconds;
            this.hours = Math.floor(this.seconds / 3600);
            this.minutes = Math.floor(this.seconds % 3600 / 60);
            this.seconds = Math.floor(this.seconds % 3600 % 60);
        }

        toString() {
            return String(this.hours).padStart(2, '0') + ':'
            + String(this.minutes).padStart(2, '0') + ':'
            + String(this.seconds).padStart(2, '0') + ','
            + this.nanos.substr(0,3);
        }

    }

    type speechV2TimeRepresentation = {
        seconds: string;
        nanos?: string;
    }

    function determineIfv2(toBeDetermined: string | speechV2TimeRepresentation): toBeDetermined is speechV2TimeRepresentation {
        return typeof toBeDetermined === 'object';
    }


    var obj = JSON.parse(string);
    var i = 1;
    var result = '';
    const array = obj.response ? obj.response.results : obj.results; // The object can be the full response or the response object
    for (const line of array) {
        result += i++;
        result += '\n';
        var word = line.alternatives[0].words[0];
        var time = new hourRepresentation(word.startTime);
        result += time.toString() + ' --> ';
        var word = line.alternatives[0].words[line.alternatives[0].words.length - 1];
        time = new hourRepresentation(word.endTime);
        result += time.toString() + '\n';
        result += line.alternatives[0].transcript + '\n\n';
    }
    return result;
}

