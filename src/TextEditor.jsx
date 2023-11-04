import React, { useCallback, useEffect, useState } from 'react'
import Quill from 'quill'
import "quill/dist/quill.snow.css"
import { io } from 'socket.io-client'
import { useParams } from 'react-router-dom';
import { checkEnvironment } from './checkEnvironment/checkEnvironment';


var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
];

const TextEditor = () => {
    const {id:documentId} = useParams()

    const [socket, setSocket] = useState()
    const [quill, setQuill] = useState()

    console.log(documentId);

    useEffect(() => {
        const s = io("https://texteditor-d6jl.onrender.com/")
        setSocket(s)
        return () => {
            s.disconnect()
        }
    }, [])



    useEffect(() => {
        if (socket == null || quill == null) return

        socket.once("load-document",document=>{
            quill.setContents(document)
            quill.enable()
        })        

        socket.emit('get-document',documentId)
    }, [socket, quill,documentId])



    //show in dupicate tab
    useEffect(() => {
        if (socket == null || quill == null) return

        const handler = (delta) => {
            quill.updateContents(delta)
        }

        socket.on('receive-change', handler)

        return () => {
            socket.off('receive-change', handler)
        }
    }, [socket, quill])


    useEffect(() => {
        if (socket == null || quill == null) return

        const handler = (delta, oldDelta, source) => {
            if (source !== 'user') return
            socket.emit("send-change", delta)
        }

        quill.on('text-change', handler)

        return () => {
            quill.off('text-change', handler)
        }
    }, [socket, quill])

    const SAVE_INTERVAL_MS = 2000

    useEffect(() => {
        if (socket == null || quill == null) return

        const interval = setInterval(() => {
            socket.emit('save-document',quill.getContents())
        }, SAVE_INTERVAL_MS);

        return ()=>{
            clearInterval(interval)
        }
    }, [socket, quill])
    





    // const wraperRef = useRef()

    const wraperRef = useCallback(wraper => {
        if (wraper == null) return
        wraper.innerHTML = ""
        const editor = document.createElement('div')
        wraper.append(editor)
        const q = new Quill('#container', {
            theme: "snow",
            modules: {
                toolbar: toolbarOptions
            }
        })
        q.disable()
        q.setText('lOADING...')
        setQuill(q)
    }, [])

    return (
        <div id="container" ref={wraperRef}></div>
    )
}

export default TextEditor