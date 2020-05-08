<?php

declare(strict_types=1);

namespace App\Ports\Messages\Gate;

use App\Domain\Gate\Event\GateOpened;
use App\Infrastructure\Centrifugo\Centrifugo;

final class OpenSuccessListener
{
    private Centrifugo $centrifugo;

    public function __construct(Centrifugo $centrifugo)
    {
        $this->centrifugo = $centrifugo;
    }

    public function __invoke(GateOpened $event): void
    {
        $this->centrifugo->publish('gate', [
            'open' => 'success',
            'remaining_time' => 60,
        ]);
    }
}
