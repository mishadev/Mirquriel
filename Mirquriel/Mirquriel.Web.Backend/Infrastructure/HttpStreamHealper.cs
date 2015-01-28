using System;
using System.Linq;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Hosting;

namespace Mirquriel.Web.Infrastructure
{
    public class HttpStreamHealper
    {
        int? length;
        VirtualFile virtualFile;
        public long From;
        public long To;

        public HttpStreamHealper(string virtualPath, RangeHeaderValue header)
        {
            this.virtualFile = HostingEnvironment.VirtualPathProvider.GetFile(virtualPath);
            FillRange(header.Ranges.First(), getLength(virtualFile));
        }

        public int Length
        {
            get
            {
                return this.length ?? (this.length = getLength(virtualFile)).Value;
            }
        }

        int getLength(VirtualFile virtualFile)
        {
            using (var stream = virtualFile.Open())
            {
                return (int)stream.Length;
            }
        }

        public async Task WritePartial(Stream outputStream, HttpContent context, TransportContext transfer)
        {
            var buffer = new byte[65536];
            long length = this.To - this.From + 1;
            var bytesRead = 1;

            try
            {
                using (outputStream)
                using (var stream = virtualFile.Open())
                {
                    stream.Position = this.From;
                    while (length > 0 && bytesRead > 0)
                    {
                        bytesRead = stream.Read(buffer, 0, (int)Math.Min(length, buffer.LongLength));
                        await outputStream.WriteAsync(buffer, 0, bytesRead);
                        length -= bytesRead;
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.Write(ex.Message);
            }
        }

        public async Task WriteAll(Stream outputStream, HttpContent context, TransportContext transfer)
        {
            var buffer = new byte[65536];
            try
            {
                using (outputStream)
                using (var stream = virtualFile.Open())
                {
                    await stream.CopyToAsync(outputStream, 65536);
                }
            }
            catch (Exception ex)
            {
                Debug.Write(ex.Message);
            }
        }

        void FillRange(RangeItemHeaderValue headerValue, long contentLength)
        {
            if (headerValue != null)
            {
                this.From = headerValue.From ?? (headerValue.To.HasValue ? contentLength - headerValue.To.Value : 0);
                this.To = headerValue.To ?? contentLength - 1;
            }

            var isValidRange = this.From < this.To && this.To < contentLength && this.From >= 0;

            if (!isValidRange)
            {
                this.From = 0;
                this.To = contentLength - 1;
            }
        }
    }
}