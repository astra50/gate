<?php

declare(strict_types=1);

namespace App\Ports\Messages\Gate;

use App\Domain\Gate\Event\GateOpenFailed;
use phpcent\Client as Centrifugo;

final class OpenFailedListener
{
    private Centrifugo $centrifugo;

    public function __construct(Centrifugo $centrifugo)
    {
        $this->centrifugo = $centrifugo;
    }

    public function __invoke(GateOpenFailed $event): void
    {
        $this->centrifugo->publish('gate', [
            'open' => 'fail',
            'reason' => 'Wooops...',
        ]);
    }
}
