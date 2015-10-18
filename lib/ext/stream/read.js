'use strict';

/**
 * @method read
 * @summary Reads the entire stream
 *
 * @param {Object} stream
 * Readable stream
 * @param {Function} receiver
 * Function to receive the data for processing.
 *
 * Parameters:
 *  - `index` = index of the call made to the receiver
 *  - `data` = array of data reads from the stream
 *  - `delay` = number of milliseconds since the last call (`undefined` when `index=0`)
 *
 * @param {Boolean} [closable=false]
 * Instructs the method to resolve on event `close` supported by the stream,
 * as opposed to the event `end` that's used by default.
 *
 * @param {Number} [readSize]
 * Sets the read size from the stream buffer when the data is available.
 * By default, the method reads all the data available in the buffer.
 *
 * @returns {Promise}
 * When successful, resolves with object `{calls, reads, size, duration}`:
 *  - `calls` = number of calls made into the receiver
 *  - `reads` = number of successful reads from the stream
 *  - `size` = total number of bytes read from the stream
 *  - `duration` = number of milliseconds consumed by the method
 */
function read(stream, receiver, closable, readSize) {

    if (!$utils.isReadableStream(stream)) {
        throw new TypeError("Readable stream is required.");
    }

    if (typeof receiver !== 'function') {
        throw new TypeError("Invalid stream receiver.");
    }

    readSize = (readSize > 0) ? parseInt(readSize) : null;

    var self = this, reads = 0, size = 0, start = Date.now(),
        index = 0, cbTime, ready, waiting, stop;

    return $p(function (resolve, reject) {

        function onReadable() {
            ready = true;
            process();
        }

        function onEnd() {
            if (!closable) {
                finish();
            }
        }

        function onClose() {
            if (closable) {
                finish();
            }
        }

        function onError(error) {
            stop = true;
            cleanup();
            reject(error);
        }

        stream.on('readable', onReadable);
        stream.on('end', onEnd);
        stream.on('close', onClose);
        stream.on('error', onError);

        function process() {
            if (!ready || stop || waiting) {
                return;
            }
            ready = false;
            waiting = true;
            var page, data = [];
            do {
                page = stream.read(readSize);
                if (page) {
                    data.push(page);
                    size += page.length;
                    reads++;
                }
            } while (page);

            if (!data.length) {
                waiting = false;
                return;
            }

            var result, cbNow = Date.now(),
                cbDelay = index ? (cbNow - cbTime) : undefined;
            cbTime = cbNow;
            try {
                result = receiver.call(self, index++, data, cbDelay);
            } catch (e) {
                stop = true;
                reject(e);
                return;
            }

            if ($utils.isPromise(result)) {
                result.then(function () {
                    waiting = false;
                    process();
                }, function (reason) {
                    stop = true;
                    reject(reason);
                });

            } else {
                waiting = false;
                process();
            }
        }

        function finish() {
            cleanup();
            resolve({
                calls: index,
                reads: reads,
                size: size,
                duration: Date.now() - start
            });
        }

        function cleanup() {
            stream.removeListener('readable', onReadable);
            stream.removeListener('close', onClose);
            stream.removeListener('error', onError);
            stream.removeListener('end', onEnd);
        }
    });
}

var $utils, $p;

module.exports = function (config) {
    $utils = config.utils;
    $p = config.promise;
    return read;
};
