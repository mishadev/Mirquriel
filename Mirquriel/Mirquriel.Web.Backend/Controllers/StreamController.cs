using Mirquriel.Web.Infrastructure;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Web.Http;

namespace Movie.Controllers
{
    [Route("api/stream")]
    public class MediaController : ApiController
    {
        [HttpGet]
        public HttpResponseMessage Play(string mimetype, string key)
        {
            var mime = mimetype.Split(new[] { "_", "/" }, StringSplitOptions.RemoveEmptyEntries);
            var path = string.Format("~/{0}s/{1}.{2}", mime[0], key, mime[1]);

            var rangeHeader = base.Request.Headers.Range;
            var response = Request.CreateResponse();
            var streamHelper = new HttpStreamHealper(path, rangeHeader);

            response.Headers.AcceptRanges.Add("bytes");

            if (rangeHeader == null || !rangeHeader.Ranges.Any())
            {
                response.StatusCode = HttpStatusCode.OK;
                response.Content = new PushStreamContent(streamHelper.WriteAll, MediaTypeNames.Application.Octet);
                response.Content.Headers.ContentLength = streamHelper.Length;

                return response;
            }

            response.StatusCode = HttpStatusCode.PartialContent;
            response.Content = new PushStreamContent(streamHelper.WritePartial, MediaTypeNames.Application.Octet);
            response.Content.Headers.ContentLength = streamHelper.To - streamHelper.From + 1;
            response.Content.Headers.ContentRange = new ContentRangeHeaderValue(streamHelper.From, streamHelper.To, streamHelper.Length);

            return response;
        }
    }
}
