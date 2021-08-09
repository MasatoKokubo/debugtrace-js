/**
 * @file logbuffer.js
 * @copyright 2015 Masato Kokubo
 * @license MIT
 */
"use strict"

/**
 * Buffers logs.
 *
 * @since 2.0.0
 * @author Masato Kokubo
 */
module.exports = class LogBuffer {
    /**
     * Constructs a LogBuffer.
     * @param {number} maximumDataOutputWidth Maximum output width of data
     */
    constructor(maximumDataOutputWidth) {
        this._maximumDataOutputWidth = maximumDataOutputWidth
        this._nestLevel = 0
        this._appendNestLevel = 0

        // tuples of data indentation level and log string
        this._lines = []

        // buffer for a line of logs
        this._lastLine = ''
    }

    /**
     * Breaks the current line.
     */
    lineFeed() {
        this._lines.push([this._nestLevel + this._appendNestLevel, this._lastLine.replace(/ +$/, '')])
        this._appendNestLevel = 0
        this._lastLine = ''
    }

    /**
     * Ups the nest level.
     */
    upNest() {
        ++this._nestLevel
    }

    /**
     * Downs the nest level.
     */
    downNest() {
        --this._nestLevel
    }

    /**
     * Appends a string representation of the value.
     *
     * @param {object} value the value to append
     * @param {number} nestLevel the nest level of the value
     * @param {boolean} noBreak if true, does not break even if the maximum width is exceeded
     * @return {LogBuffer} this object
     */
    append(value, nestLevel = 0, noBreak = false) {
        const str = value.toString()
        if (!noBreak && this.length > 0 && this.length + str.length > this._maximumDataOutputWidth)
            this.lineFeed()
        this._appendNestLevel = nestLevel
        this._lastLine += str
        return this
    }

    /**
     * Appends a string representation of the value.
     * Does not break even if the maximum width is exceeded.
     *
     * @param {object} value the value to append
     * @return {LogBuffer} this object
     */
    noBreakAppend(value) {
        return this.append(value, 0, true)
    }

    /**
     * Appends lines of another LogBuffer.
     *
     * @param {string} separator the separator string to append if not null
     * @param {LogBuffer} buff another LogBuffer
     * @param {boolean} noBreak if true, does not break even if the maximum width is exceeded
     * @return {LogBuffer} this object
     */
// 2.1.0
//  appendBuffer(buff) {
    appendBuffer(separator, buff) {
        if (separator != null)
            this.append(separator, 0, true)
////
        let index = 0
        for (const line of buff.lines) {
            if (index > 0)
                this.lineFeed()
        // 2.1.0
        //  this.append(line[1], line[0])
            this.append(line[1], line[0], index == 0 && separator != null)
        ////
            ++index
        }
        return this
    }

    /**
     * Returns log length of the last line.
     *
     * @return {number}  log length of the current line
     */
    get length() {
        return this._lastLine.length
    }

    /**
     * Returns true if multiple line.
     *
     * @return (boolean) true if multiple line, false otherwise
     */
    get isMultiLines() {
        return this._lines.length > 1 || this._lines.length == 1 && this.length > 0
    }

    /**
     * Returns lines
     *
     * @return (number) lines
     */
    get lines() {
        let lines = []
        lines.push(...this._lines)
        if (this.length > 0)
            lines.push([this._nestLevel, this._lastLine])
        return lines
    }
}
