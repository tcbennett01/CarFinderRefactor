namespace CarFinderRefactor.Models
{
    public class CarRecallViewModel
    {
        public Cars Car { get; set; }
        public dynamic Recalls { get; set; }
        public string Image { get; set; }
    }
}