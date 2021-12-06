<?php

declare(strict_types=1);

namespace App\Ports\Messages\Gate;

use App\Application\Gate\Open\OpenCommand;
use App\Domain\Gate\Event\GateOpenRequested;
use SimpleBus\SymfonyBridge\Bus\CommandBus;

final class OpenRequestedListener
{
    private CommandBus $commandBus;

    public function __construct(CommandBus $commandBus)
    {
        $this->commandBus = $commandBus;
    }

    public function __invoke(GateOpenRequested $event): void
    {
        $this->commandBus->handle(
            new OpenCommand($event->requestId, $event->userId)
        );
    }
}
