//using Bing;
using CarFinderRefactor.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;


namespace CarFinderRefactor.Controllers.API
{   
    [RoutePrefix("api/Cars")]
    public class CarAPIController : ApiController
    {
        private ApplicationDbContext _db = new ApplicationDbContext();

        [Route("Years")]
        public async Task<List<string>> GetYears()
        {
            return await _db.GetYears();
        }

        [Route("Makes")]
        public async Task<List<string>> GetMakes(string _year)
        {
            return await _db.GetMakes(_year);
        }

        [Route("Models")]
        public async Task<List<string>> GetModels(string _year, string _make)
        {
            return await _db.GetModels(_year, _make);
        }

        [Route("Trims")]
        public async Task<List<string>> GetTrims(string _year, string _make, string _model)
        {
            return await _db.GetTrims(_year, _make, _model);
        }

        [Route("Car")]
        public async Task<Cars> GetCarDetails(string year, string make, string model, string trim)
        {
            return await _db.GetCar(year, make, model, trim);
        }


        [Route("getCar")]
        public async Task<IHttpActionResult> getCarData(string year = "", string make = "", string model = "", string trim = "")
        {
            var car = new CarRecallViewModel();

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3 | 
                                                   SecurityProtocolType.Tls | 
                                                   SecurityProtocolType.Tls11 | 
                                                   SecurityProtocolType.Tls12;

            car.Car = await GetCarDetails(year, make, model, trim);
            car.Recalls = await GetRecalls(year, make, model);
            car.Image = await GetCarImage(year, make, model);

            return Ok(car);
        }

        private async Task<dynamic> GetRecalls(string year, string make, string model)
        {
            using (var client = new HttpClient())
            {
                HttpResponseMessage response;
                client.BaseAddress = new Uri("https://one.nhtsa.gov/");
                string result = "";
                try
                {
                    response = await client.GetAsync("webapi/api/Recalls/vehicle/modelyear/" + year.ToLower() + "/make/" + make.ToLower() + "/model/" + model.ToLower() + "?format=json");
                    result = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject(result);
                }
                catch (Exception e)
                {
                    return InternalServerError(e);
                }

            }
        }

        private async Task<dynamic> GetCarImage(string year, string make, string model)
        {
            using (var client = new HttpClient())
            {
                HttpResponseMessage response;
                var accountKey = ConfigurationManager.AppSettings["bingSearchKey"];
                client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", accountKey);

                // Query params
                string query = year + " " + make + " " + model + " stock image";
                string count = "1";
                string offset = "0";
                string mkt = "en-US";

                var imgSearchBaseUrl = "https://api.cognitive.microsoft.com/bing/v7.0/search?";
                var result = "";
                try
                {
                    response = await client.GetAsync(string.Format("{0}q={1}&mkt={2}&count={3}&offset={4}", imgSearchBaseUrl, WebUtility.UrlEncode(query), mkt, count, offset));
                    result = await response.Content.ReadAsStringAsync();

                    dynamic data = JsonConvert.DeserializeObject(result);
                    var imageItems = data.images.value;               
                    return imageItems[0].contentUrl;
                }
                catch (Exception e)
                {
                    return InternalServerError(e);
                }

            }
        }
    }
}
