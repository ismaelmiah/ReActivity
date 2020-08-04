using System.Collections.Generic;
using Domain;
using Newtonsoft.Json;

namespace Application.Profiles
{
    public class Profile
    {
        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string Image { get; set; }
        public string Bio { get; set; }
        [JsonProperty("Following")]
        public bool IsFollowed { get; set; }
        public int FollowerCount { get; set; }
        public int FollowingCount { get; set; }
        public virtual ICollection<Photo> Photos { get; set; }
    }
}