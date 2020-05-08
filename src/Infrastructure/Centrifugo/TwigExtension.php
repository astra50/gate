<?php

declare(strict_types=1);

namespace App\Infrastructure\Centrifugo;

use App\Domain\User\UserId;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

final class TwigExtension extends AbstractExtension
{
    private Centrifugo $centrifugo;

    public function __construct(Centrifugo $centrifugo)
    {
        $this->centrifugo = $centrifugo;
    }

    /**
     * {@inheritdoc}
     */
    public function getFunctions(): array
    {
        return [
            new TwigFunction(
                'centrifugo_connection_token',
                fn (UserId $userId) => $this->centrifugo->generateConnectionToken($userId)
            ),
        ];
    }
}
