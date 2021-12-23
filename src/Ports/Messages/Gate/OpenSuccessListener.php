<?php

declare(strict_types=1);

namespace App\Ports\Messages\Gate;

use App\Domain\Gate\Event\GateOpened;
use App\Domain\Gate\GateRemaining;
use App\Infrastructure\Centrifugo\Centrifugo;

final class OpenSuccessListener
{
    private Centrifugo $centrifugo;

    private GateRemaining $remaining;

    public function __construct(Centrifugo $centrifugo, GateRemaining $remaining)
    {
        $this->centrifugo = $centrifugo;
        $this->remaining = $remaining;
    }

    public function __invoke(GateOpened $event): void
    {
        $this->centrifugo->publish('gate', [
            'open' => 'success',
            'remaining_time' => $this->remaining->getRemainingTime($event->gateId),
            'gate_id' => $event->gateId->toString(),
        ]);
    }
}
