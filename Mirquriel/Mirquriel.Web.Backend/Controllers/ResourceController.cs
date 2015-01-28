using Resources;
using System.Linq;
using System.Collections.Generic;
using System.Globalization;
using System.Resources;
using System.Web.Http;
using System.Collections;

namespace Mirquriel.Web.Controllers
{
    [Route("api/resources")]
    public class ResourceController : ApiController
    {
        [HttpGet]
        public IDictionary<string, string> GetResources() {
            ResourceSet resourceSet = Text.ResourceManager.GetResourceSet(CultureInfo.CurrentUICulture, true, true);

            return resourceSet.Cast<DictionaryEntry>().ToDictionary(e => (string)e.Key, e => (string)e.Value);
        }
    }
}
