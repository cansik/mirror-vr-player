package ch.zhdk.vr

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import io.ktor.application.install
import io.ktor.features.*
import io.ktor.gson.GsonConverter
import io.ktor.http.ContentType
import io.ktor.http.cio.websocket.Frame
import io.ktor.locations.KtorExperimentalLocationsAPI
import io.ktor.locations.Locations
import io.ktor.routing.routing
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.websocket.WebSockets
import kotlinx.coroutines.channels.SendChannel
import java.time.Duration
import java.util.concurrent.CopyOnWriteArrayList

@KtorExperimentalLocationsAPI
class VRPlayerServer {
    companion object {
        @JvmStatic
        fun main(args: Array<String>) {
            VRPlayerServer().start(args)
        }
    }

    val gson: Gson = GsonBuilder()
        .setPrettyPrinting()
        .excludeFieldsWithoutExposeAnnotation()
        .serializeSpecialFloatingPointValues()
        .create()

    val channels = CopyOnWriteArrayList<SendChannel<Frame>>()

    fun start(args: Array<String>) {
        val server = embeddedServer(Netty, port = 8900) {
            install(DefaultHeaders)
            install(CallLogging)
            install(Locations)
            install(ConditionalHeaders)
            install(PartialContent) {
                maxRangeCount = 10
            }
            install(Compression) {
                default()
                excludeContentType(ContentType.Video.Any)
            }
            install(CORS)
            {
                anyHost()
            }
            install(ContentNegotiation) {
                register(ContentType.Application.Json, GsonConverter(gson))
            }
            install(WebSockets) {
                pingPeriod = Duration.ofSeconds(60) // Disabled (null) by default
                timeout = Duration.ofSeconds(15)
                maxFrameSize = Long.MAX_VALUE // Disabled (max value). The connection will be closed if surpassed this length.
                masking = false
            }

            routing {
                vrPlayerRoutes(channels)
            }
        }
        server.start()
    }
}