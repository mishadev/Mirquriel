using System.Web.Http;
using System.Web.Http.Cors;

namespace Mirquriel.Web
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
#if DEBUG
            config.EnableCors(new EnableCorsAttribute("*", "*", "*"));
#endif
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
