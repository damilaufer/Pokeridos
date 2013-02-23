using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Routing;

namespace PokeridosService
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            //@@@ POrque mierda si saco el "login" se confunde con el de abajo y no anda...
            config.Routes.MapHttpRoute(
                name: "Players",
                routeTemplate: "api/{controller}/login/{username}/{password}"
            );

            config.Routes.MapHttpRoute(
                name: "Standings",
                routeTemplate: "api/{controller}/{fromString}/{toString}"
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
