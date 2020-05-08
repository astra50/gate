<?php

declare(strict_types=1);

namespace App\Infrastructure\Gate;

use App\Domain\Gate\GateRemaining;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

final class TwigExtension extends AbstractExtension
{
    private GateRemaining $remaining;

    public function __construct(GateRemaining $remaining)
    {
        $this->remaining = $remaining;
    }

    /**
     * {@inheritdoc}
     */
    public function getFunctions(): array
    {
        return [
            new TwigFunction(
                'gate_remaining_time',
                fn () => $this->remaining->getRemainingTime(),
            ),
        ];
    }
}
