package ch.zhdk.vr

import io.ktor.application.call
import io.ktor.http.cio.websocket.Frame
import io.ktor.http.cio.websocket.readText
import io.ktor.http.content.*
import io.ktor.locations.KtorExperimentalLocationsAPI
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.get
import io.ktor.websocket.webSocket
import kotlinx.coroutines.channels.ClosedReceiveChannelException
import kotlinx.coroutines.channels.SendChannel
import java.io.File
import java.util.concurrent.CopyOnWriteArrayList


@KtorExperimentalLocationsAPI
fun Route.vrPlayerRoutes(channels: CopyOnWriteArrayList<SendChannel<Frame>>) {

    // webapp routes
    static("app/") {
        staticRootFolder = File("app/dist") // Establishes a root folder
        default("index.html")
        file("bundle.js", "bundle.js")
        file("main.css", "main.css")
        static("libs") {
            files("libs")
        }
        static("assets") {
            files("assets")
        }
        static("") {
            files("")
        }
    }

    // api routes
    get("api/player/") {
        call.respond("Players Active: ${channels.size}")
    }

    webSocket("api/player") {
        try {
            channels.add(outgoing)

            while (true) {
                val message = (incoming.receive() as Frame.Text).readText()

                println("[MSG $incoming]: $message")

                // send message to all the others (broadcast)
                channels.filter { it != outgoing }.forEach {
                    it.send(Frame.Text(message))
                }
            }
        } catch (e: ClosedReceiveChannelException) {
            // Do nothing!
        } catch (e: Throwable) {
            e.printStackTrace()
        } finally {
            channels.remove(outgoing)
        }
    }
}