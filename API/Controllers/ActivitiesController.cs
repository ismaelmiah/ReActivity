using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using System;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ActivitiesController : ControllerBase
    {
        private readonly IMediator _mediator;
        public ActivitiesController(IMediator mediator)
        {
            _mediator = mediator;

        }

        [HttpGet]
        public async Task<ActionResult<List<Activity>>> List(CancellationToken ct){
            return await _mediator.Send(new list.Query(), ct);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> Details(Guid id){
            return await _mediator.Send(new details.Query{Id = id});
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Create(create.Command command)
        {
            return await _mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> Edit(Guid id, edit.Command command)
        {
            command.Id = id;
            return await _mediator.Send(command);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await _mediator.Send(new delete.Command{Id = id});
        }
    }
}