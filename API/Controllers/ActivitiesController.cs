using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using System;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    public class ActivitiesController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<List<ActivityDto>>> List(CancellationToken ct){
            return await Mediator.Send(new list.Query(), ct);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<ActivityDto>> Details(Guid id){
            return await Mediator.Send(new details.Query{Id = id});
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Create(create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> Edit(Guid id, edit.Command command)
        {
            command.Id = id;
            return await Mediator.Send(command);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await Mediator.Send(new delete.Command{Id = id});
        }
    }
}