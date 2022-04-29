import { writable } from 'svelte/store'
import { get } from 'svelte/store';
import chroma from "chroma-js";
import { general } from "$lib/data.js"
export const currentSection = writable('')

const changeThemeColor = color => {
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (metaThemeColor) {
        metaThemeColor.setAttribute("content", color);
    }
}

export const setThemeColors = () => {
    let root = document.documentElement;
    if (root.style) {
        root.style.setProperty('--main-color', get(general).mainColor);
        root.style.setProperty('--main-color-two', chroma(get(general).mainColor).darken(0.4).hex());
        root.style.setProperty('--main-color-three', chroma(get(general).mainColor).alpha(0.1).hex());
        root.style.setProperty('--highlight-color', get(general).highlightColor);
        changeThemeColor(get(general).mainColor);
    }
}

// ____
// ____ Date
// ___

import { format, parseISO, formatDistanceToNow, isFuture } from "date-fns"

export const dotFormatDate = date => {
    try {
        if (date) {
            return format(parseISO(date), "dd.MM.yyyy")
        }
    } catch (err) {
        console.dir(err)
    }
}

export const longFormatDate = date => {
    try {
        if (date) {
            return format(parseISO(date), "MMMM d, yyyy")
        }
    } catch (err) {
        console.dir(err)
    }
}

export const compactDateTimeFormat = date => {
    try {
        if (date) {
            return format(parseISO(date), "dd-MM-yyyy HH:mm:ss")
        }
    } catch (err) {
        console.dir(err)
    }
}

export const dateTimeFormat = date => {
    try {
        if (date) {
            return format(parseISO(date), "MMMM d, yyyy – HH:mm:ss")
        }
    } catch (err) {
        console.dir(err)
    }
}

export const shortFormatDate = date => {
    try {
        if (date) {
            return format(parseISO(date), "MMMM yyyy")
        }
    } catch (err) {
        console.dir(err)
    }
}

export const distanceToDate = date => {
    try {
        if (date) {
            const parsedDate = parseISO(date)
            if (isFuture(parsedDate)) {
                return 'On ' + format(parsedDate, "MMMM d")
            }
            return formatDistanceToNow(parsedDate) + ' ago'
        }
        return ''
    } catch (err) {
        console.dir(err)
    }
}

export const getCurrentYear = () => {
    return Number(format(new Date(), "yyyy"))
}